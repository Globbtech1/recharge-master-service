const { Sequelize } = require("sequelize");
const { CONSTANT } = require("../../../dependency/Config");
const { NotFound } = require("@feathersjs/errors");
const { AirtimePurchase } = require("../../../interfaces/airtimePurchase");
const {
  ShowCurrentDate,
  convertToNaira,
  calculateBillNextExecutionDate,
} = require("../../../dependency/UtilityFunctions");
const { pushSlackNotification } = require("../../../hooks/general-uses");
const { DataPurchase } = require("../../../interfaces/dataPurchase");

/* eslint-disable no-unused-vars */
exports.ProcessDuePayments = class ProcessDuePayments {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    // let result = await this.app.service("payment-list").find({
    //   where: {
    //     deletedAt: null,
    //     paymentType: "debit",
    //   },
    // });
    const sequelize = this.app.get("sequelizeClient");

    const { schedule_bills_payment, product_list } = sequelize.models;
    let limit = 5;
    // const result = await payment_list.findAll({
    //   where: {
    //     deletedAt: null,
    //     paymentType: "debit",
    //   },
    //   attributes: {
    //     exclude: [
    //       "deletedAt",
    //       "status",
    //       "password",
    //       "paymentType",
    //       "createdAt",
    //       "updatedAt",
    //       // "id",
    //     ],
    //   },
    // });
    // return Promise.resolve(
    //   successMessage(result, "All available payment list ")
    // );
    try {
      const currentDate = new Date(); // Get the current date and time
      const scheduledPayments = await schedule_bills_payment.findAll({
        where: {
          nextExecution: {
            [Sequelize.Op.lte]: currentDate, // Op.lte stands for "less than or equal to"
          },
        },
        include: [
          {
            model: product_list, // Include the product_list association
            // where: {
            //   id: productListId, // Filter by the specified productListId
            // },
          },
        ],
        limit: limit,
      });
      return this.processDuePayments(scheduledPayments);
      // return scheduledPayments;
    } catch (error) {
      console.error("Error fetching scheduled payments:", error);
      throw error;
    }
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  // Check if a payment is due and process it
  async processDuePayments(scheduledPayments) {
    // const scheduledPayments = await getScheduledPayments();

    scheduledPayments.forEach((scheduledPayment) => {
      // if (isPaymentDueForProcessing(scheduledPayment)) {
      //   // Payment is due, update last execution and process
      //   updateLastExecution(scheduledPayment)
      //     .then(() => {
      //       performBillPayment(scheduledPayment);
      //     })
      //     .catch((error) => {
      //       console.error("Error processing payment:", error);
      //       // Handle any errors here, e.g., update the transaction status to 'Failed'
      //     });
      // }
      this.performBillPayment(scheduledPayment);
    });
    return scheduledPayments;
  }

  async performBillPayment(scheduledPayment) {
    const maxRetries = 5; // Maximum number of retries allowed
    const { frequency, dayOfWeek, dayOfMonth, lastExecution } =
      scheduledPayment;
    try {
      let retryCount = scheduledPayment.retryCount || 0;

      if (retryCount < maxRetries) {
        // Attempt to process the payment here
        const paymentSuccessful = await this.attemptPayment(scheduledPayment);

        if (paymentSuccessful) {
          // Payment was successful, reset the retry count
          let nextDateData = {
            frequency,
            dayOfWeekString: dayOfWeek,
            dayOfMonth,
            lastExecution,
          };
          console.log(nextDateData, "nextDateData");
          const nextExecutionDate =
            calculateBillNextExecutionDate(nextDateData);
          const currentDate = new Date();

          scheduledPayment.lastExecutionPaymentStatus =
            CONSTANT.transactionStatus.success;
          scheduledPayment.lastExecution = currentDate;
          scheduledPayment.nextExecution = nextExecutionDate;

          scheduledPayment.retryCount = 0;
          await scheduledPayment.save();
          // break; // Exit the retry loop
        } else {
          // Payment failed, increment the retry count and update the payment status
          // retryCount++;
          const currentDate = new Date();

          scheduledPayment.lastExecutionPaymentStatus =
            CONSTANT.transactionStatus.failed;
          scheduledPayment.lastExecution = currentDate;
          scheduledPayment.retryCount = scheduledPayment.retryCount + 1;
          await scheduledPayment.save();
          // await scheduledPayment.save();
        }
      }

      if (retryCount >= maxRetries) {
        // Maximum retry count reached, handle accordingly (e.g., notify user, mark payment as failed)
        console.error(
          "Maximum retry count reached for payment:",
          scheduledPayment.id
        );
        // Update payment status to 'Failed' or take appropriate action
        let nextDateData = {
          frequency,
          dayOfWeekString: dayOfWeek,
          dayOfMonth,
          lastExecution,
        };
        console.log(nextDateData, "nextDateData");
        const nextExecutionDate = calculateBillNextExecutionDate(nextDateData);
        const currentDate = new Date();

        scheduledPayment.lastExecutionPaymentStatus =
          CONSTANT.transactionStatus.failed;
        scheduledPayment.lastExecution = currentDate;
        scheduledPayment.retryCount = 0;
        scheduledPayment.nextExecution = nextExecutionDate;

        await scheduledPayment.save();
        // await scheduledPayment.save()
      }
    } catch (error) {
      console.error("Error processing bill payment:", error);
      // Handle any errors here
      return;
    }
  }

  async attemptPayment(scheduledPayment) {
    console.log(JSON.stringify(scheduledPayment), "scheduledPayment....");
    const {
      product_list,
      PaymentMetaData,
      userId: loggedInUserId,
      productListId: productId,
      purchaseAmount: amount,
    } = scheduledPayment;
    const { slug: transactionType } = product_list;
    console.log(transactionType, "transactionType");
    // return;
    // const { account_balance } = sequelize.models;
    //   const { paymentReference } = params?.query;
    let purchase;
    let purchaseMetaData;
    let data;
    let fundSource = CONSTANT.transactionInitiator.schedule;
    const balanceResult = await this.CheckAccountBalance(
      loggedInUserId,
      amount
    );
    console.log(balanceResult, "<<<<<balanceResult>>>>>.....");
    //  const userAccountBalance = await getUserAccountBalanceInfo(
    //    account_balance,
    //    loggedInUserId
    //  );
    if (balanceResult.hasSufficientBalance) {
      const availableBalance = balanceResult.balance;
      if (transactionType === CONSTANT.billsPaymentType.data) {
        console.log(
          CONSTANT.billsPaymentType.data,
          "CONSTANT.billsPaymentType.data"
        );
        console.log(
          CONSTANT.billsPaymentType.airtime,
          "CONSTANT.billsPaymentType.airtime"
        );
        let payload = JSON.parse(PaymentMetaData);
        console.log(payload, "paymentPayload");
        const {
          phone: phoneNumber,
          amountInNaira,
          service_type: provider,
        } = payload;

        try {
          let dataPurchase = new DataPurchase();
          let PurchasePaymentResponse = await dataPurchase.buyDataPlans(
            payload
          );
          console.log(PurchasePaymentResponse, "PurchasePaymentResponse");
          let response = this.RecordHistoryAndComplete(
            PurchasePaymentResponse,
            phoneNumber,
            provider,
            fundSource,
            loggedInUserId,
            amount,
            availableBalance,
            productId
          );

          return response;
        } catch (error) {
          console.log(error, "pppppp");
          let errorMessage =
            error?.response?.data?.error?.message ||
            "Unable to process your request";
          console.error("An error occurred: ", error.message);
          pushSlackNotification(error?.response?.data, "error");
          let metaData = {
            "Transaction ID": "nill",
            "Phone Number": phoneNumber,
            "Network Provider": provider.toUpperCase(),
            "Paid By": fundSource,
            Date: ShowCurrentDate(),
            Amount: convertToNaira(amount),
            Status: CONSTANT.transactionStatus.failed,
          };

          let transactionHistory = {
            userId: loggedInUserId,
            paymentType: "debit",
            amountBefore: convertToNaira(availableBalance),
            amountAfter: convertToNaira(availableBalance),
            referenceNumber: "Nill",
            metaData: JSON.stringify(metaData),
            productListId: productId,
            transactionDate: ShowCurrentDate(),
            amount: convertToNaira(amount),
            transactionStatus: CONSTANT.transactionStatus.failed,
            paidBy: fundSource,
          };
          this.app.service("transactions-history").create(transactionHistory);
          // return Promise.reject(new BadRequest(errorMessage));
          return false;
        }
      }
      if (transactionType === CONSTANT.billsPaymentType.airtime) {
        console.log(
          CONSTANT.billsPaymentType.airtime,
          "CONSTANT.billsPaymentType.airtime"
        );
        let payload = JSON.parse(PaymentMetaData);
        console.log(payload, "paymentPayload");
        const {
          phone: phoneNumber,
          amountInNaira,
          service_type: provider,
        } = payload;

        try {
          let airtimePurchase = new AirtimePurchase();
          let airtimePaymentResponse = await airtimePurchase.buyAirtime(
            payload
          );
          console.log(airtimePaymentResponse, "airtimePaymentResponse");
          let response = this.RecordHistoryAndComplete(
            airtimePaymentResponse,
            phoneNumber,
            provider,
            fundSource,
            loggedInUserId,
            amount,
            availableBalance,
            productId
          );

          return response;
        } catch (error) {
          console.log(error, "pppppp");
          let errorMessage =
            error?.response?.data?.error?.message ||
            "Unable to process your request";
          console.error("An error occurred: ", error.message);
          pushSlackNotification(error?.response?.data, "error");
          let metaData = {
            "Transaction ID": "nill",
            "Phone Number": phoneNumber,
            "Network Provider": provider.toUpperCase(),
            "Paid By": fundSource,
            Date: ShowCurrentDate(),
            Amount: convertToNaira(amount),
            Status: CONSTANT.transactionStatus.failed,
          };

          let transactionHistory = {
            userId: loggedInUserId,
            paymentType: "debit",
            amountBefore: convertToNaira(availableBalance),
            amountAfter: convertToNaira(availableBalance),
            referenceNumber: "Nill",
            metaData: JSON.stringify(metaData),
            productListId: productId,
            transactionDate: ShowCurrentDate(),
            amount: convertToNaira(amount),
            transactionStatus: CONSTANT.transactionStatus.failed,
            paidBy: fundSource,
          };
          this.app.service("transactions-history").create(transactionHistory);
          // return Promise.reject(new BadRequest(errorMessage));
          return false;
        }
      }

      return Promise.reject(new NotFound("Transaction not found"));
    } else {
      console.error("Insufficient balance. Cannot process payment.");
      // Handle insufficient balance case
    }
  }

  async CheckAccountBalance(loggedInUserId, amount) {
    const sequelize = this.app.get("sequelizeClient");
    const { account_balance } = sequelize.models;

    try {
      const accountBalance = await account_balance.findOne({
        where: {
          userId: loggedInUserId,
          deletedAt: null,
        },
      });
      console.log(accountBalance, "fetched Balance");
      if (accountBalance !== null) {
        const { balance } = accountBalance;

        if (amount > balance) {
          return { hasSufficientBalance: false, balance };
        }

        return { hasSufficientBalance: true, balance };
      } else {
        // Handle the case when the account balance record is not found
        console.error(
          "Account balance record not found for user:",
          loggedInUserId
        );
        return { hasSufficientBalance: false, balance: 0 };
      }
    } catch (error) {
      console.error("Error checking account balance:", error);
      return { hasSufficientBalance: false, balance: 0 };
    }
  }

  async RecordHistoryAndComplete(
    airtimePaymentResponse,
    phoneNumber,
    provider,
    fundSource,
    loggedInUserId,
    amount,
    availableBalance,
    productId
  ) {
    console.log(availableBalance, "availableBalance");
    let providerStatus = airtimePaymentResponse?.status;
    if (providerStatus != "success") {
      console.log("in Error Block");
      let metaData = {
        "Transaction ID": "nill",
        "Phone Number": phoneNumber,
        "Network Provider": provider.toUpperCase(),
        "Paid By": fundSource,
        Date: ShowCurrentDate(),
        Amount: convertToNaira(amount),
        Status: CONSTANT.transactionStatus.failed,
      };

      let transactionHistory = {
        userId: loggedInUserId,
        paymentType: "debit",
        amountBefore: convertToNaira(availableBalance),
        amountAfter: convertToNaira(availableBalance),
        referenceNumber: "Nill",
        metaData: JSON.stringify(metaData),
        productListId: productId,
        transactionDate: ShowCurrentDate(),
        amount: convertToNaira(amount),
        transactionStatus: CONSTANT.transactionStatus.failed,
        paidBy: fundSource,
      };
      this.app.service("transactions-history").create(transactionHistory);

      // return Promise.reject(
      //   new BadRequest(
      //     "Transaction was not successful, please try again."
      //   )
      // );

      // await scheduledPayment.save();
      return false;
      // TODO we need to be sure the provider is not given the user the value.
      // TODO this side need to be tested properly on live
    }
    await this.DebitUserAccount(loggedInUserId, amount);
    let newBalance = parseFloat(availableBalance) - parseFloat(amount);
    let transactionReference = airtimePaymentResponse?.reference;
    let metaData = {
      "Transaction ID": transactionReference,
      "Phone Number": phoneNumber,
      "Network Provider": provider.toUpperCase(),
      "Paid By": fundSource,
      Date: ShowCurrentDate(),
      Amount: convertToNaira(amount),
      Status: CONSTANT.transactionStatus.success,
    };

    let transactionHistory = {
      userId: loggedInUserId,
      paymentType: "debit",
      amountBefore: convertToNaira(availableBalance),
      amountAfter: convertToNaira(newBalance),
      referenceNumber: transactionReference,
      metaData: JSON.stringify(metaData),
      productListId: productId,
      transactionDate: ShowCurrentDate(),
      amount: convertToNaira(amount),
      transactionStatus: CONSTANT.transactionStatus.success,
      paidBy: fundSource,
    };
    let responseTransaction = await this.app
      .service("transactions-history")
      .create(transactionHistory);

    // return Promise.resolve(
    //   successMessage(
    //     airtimePaymentResponse,
    //     CONSTANT.successMessage.airtimePurchase
    //   )
    // );
    let additionalOrderDetails = {
      slackNotificationData: airtimePaymentResponse,
      provider,
      // scheduleMeta: payload,
    };
    responseTransaction = {
      ...responseTransaction,
      ...additionalOrderDetails,
      // ...data,
    };

    return true;
  }
  async DebitUserAccount(loggedInUserId, amount) {
    const sequelize = this.app.get("sequelizeClient");
    // const { account_balance } = sequelize.models;
    const { account_balance } = sequelize.models;
    //  const { amount } = data;
    //  let loggedInUserId = params?.user?.id;
    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUserId,
      },
    });

    if (account_balanceDetails !== null) {
      let availableBalance = account_balanceDetails?.balance;
      console.log(availableBalance, "availableBalance");
      console.log(amount, "amount");
      let currentBalance = parseFloat(availableBalance) - amount;
      console.log(currentBalance, "currentBalance");

      let walletId = account_balanceDetails?.id;
      let Update_payload = {
        balance: currentBalance,
      };
      // await this.app.service("account-balance").patch(walletId, Update_payload);
      // account_balance.patch(walletId, Update_payload);
      await account_balance
        .update(Update_payload, {
          where: { id: walletId }, // Define the condition for the update
        })
        .then((updatedRecords) => {
          console.log(`Updated ${updatedRecords[0]} record(s).`);
        })
        .catch((error) => {
          console.error("Error updating record:", error);
        });
    } else {
      console.log("unable to load user account balance details");
      //  return Promise.reject(new BadRequest("Unable to complete your request"));
    }
  }
  async DebitUserAccount3333(loggedInUserId, amount) {
    const sequelize = this.app.get("sequelizeClient");
    const { account_balance } = sequelize.models;

    try {
      const transaction = await sequelize.transaction(); // Start a transaction

      const account_balanceDetails = await account_balance.findOne({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
        },
        transaction, // Include the transaction in this query
      });

      if (account_balanceDetails !== null) {
        let availableBalance = account_balanceDetails.balance;
        console.log(availableBalance, "availableBalance");
        console.log(amount, "amount");
        let currentBalance = parseFloat(availableBalance) - amount;
        console.log(currentBalance, "currentBalance");

        let walletId = account_balanceDetails.id;
        let Update_payload = {
          balance: currentBalance,
        };

        await account_balance.update(Update_payload, {
          where: { id: walletId },
          transaction, // Include the transaction in this update
        });

        await transaction.commit(); // Commit the transaction

        console.log(`Debited user account. Updated balance: ${currentBalance}`);
      } else {
        console.log("Unable to load user account balance details");
        // Handle the case where account_balanceDetails is null
      }
    } catch (error) {
      console.error("Error debiting user account:", error);
      await transaction.rollback(); // Rollback the transaction in case of an error
    }
  }
};
