// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const Sentry = require("@sentry/node");

const { Op } = require("sequelize");
const {
  generateRandomNumber,
  errorMessage,
  successMessage,
  generateRandomString,
  ShowCurrentDate,
  convertToNaira,
  convertToKobo,
  getProviderSourceImage,
  compareHashData,
  removeSensitiveKeys,
  calculateBillNextExecutionDate,
} = require("../dependency/UtilityFunctions");

const {
  changeUserEmailValidator,
  userEmailVerifyValidator,
} = require("../validations/auth.validation");
const { ReserveBankAccount, pushSlackNotification } = require("./general-uses");
const { getUserAccountBalanceInfo } = require("./userFund.hook");
const { customLog } = require("../dependency/customLoggers");
const { CONSTANT } = require("../dependency/Config");
var paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

// eslint-disable-next-line no-unused-vars

const checkAvailableBalance = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    // console.log(params, "dataSent.........");
    // console.log(params.user, "dataSent.........");
    let loggedInUserId = params?.user?.id;
    const { account_balance, transactions_history } = sequelize.models;

    const { paymentMethod, amountToPay, paymentReference } = data;
    if (paymentMethod === "paystack") {
      const validatePaymentReference = await transactions_history.findOne({
        where: {
          deletedAt: null,
          referenceNumber: paymentReference,
          paymentMethod: "paystack",
        },
      });

      if (validatePaymentReference !== null) {
        return Promise.reject(
          new BadRequest(
            "Payment reference in use please contact customer support "
          )
        );
      }

      let verifyResponse = await paystack.transaction.verify(paymentReference);
      console.log(verifyResponse, "verifyResponse");
      const { status, data: paystackData, message } = verifyResponse;
      customLog(status, paystackData, message);

      if (status) {
        console.log(data, "ppppppppppp");
        const {
          status: transactionStatus,
          amount,
          authorization,
          reference,
          channel: paymentMethod,
        } = paystackData;
        console.log(transactionStatus, "pooppoopop");
        if (transactionStatus === CONSTANT.payStackPaymentStatus.success) {
          let nairaAmount = convertToNaira(amount);
          let amountToPayInNaira = convertToNaira(amountToPay);
          console.log(nairaAmount, "nairaAmount");
          console.log(amountToPayInNaira, "amountToPayInNaira");
          let amountSettled = nairaAmount;
          let amountPaid = nairaAmount;
          let transactionReference = reference;
          if (nairaAmount < amountToPayInNaira) {
            return Promise.reject(
              new BadRequest("Amount paid is less than the value")
            );
          }

          //  const accountDetailsDetails = await fund_innitiator.findOne({
          //    where: {
          //      deletedAt: null,
          //      reference: reference,
          //    },
          //  });
          //  if (accountDetailsDetails === null) {
          //    const notFound = new NotFound("User not found at the moment");
          //    return Promise.reject(notFound);
          //  }
          //  let accountOwnerId = accountDetailsDetails?.userId;
          const account_balanceDetails = await account_balance.findOne({
            where: {
              deletedAt: null,
              userId: loggedInUserId,
            },
          });

          let availableBalance = 0;

          if (account_balanceDetails !== null) {
            availableBalance = account_balanceDetails?.balance;

            // this.app.service("account-balance").patch(walletId, Update_payload);
            // this.app
            //   .service("accountFunding/fund-innitiator")
            //   .patch(accountDetailsDetails?.id, {
            //     status: CONSTANT.transactionStatus.success,
            //   });

            // let funding = {
            //   userId: accountOwnerId,
            //   amount: amountSettled,
            //   amountBefore: convertToNaira(availableBalance),
            //   amountAfter: convertToNaira(currentBalance),
            //   source: `${paymentMethod} ||| ${transactionReference}`,
            // };
            // let metaData = {
            //   amount: amountPaid,
            //   paymentMethod: paymentMethod,
            //   // ...accountDetails,
            //   transactionDate: ShowCurrentDate(),
            // };
            // let fundingHistory = {
            //   userId: accountOwnerId,
            //   paymentType: "credit",
            //   amountBefore: convertToNaira(availableBalance),
            //   amountAfter: convertToNaira(currentBalance),
            //   referenceNumber: transactionReference,
            //   metaData: JSON.stringify(metaData),
            //   productListId: product_listDetails?.id || 0,
            //   transactionDate: ShowCurrentDate(),
            //   amount: amountPaid,
            //   transactionStatus: CONSTANT.transactionStatus.success,
            //   paidBy: "self",
            // };
            // let ResponseData = {
            //   accountFundingData: funding,
            //   ...data,
            //   payHistory: fundingHistory,
            // };
            let additionalOrderDetails = {
              availableBalance: availableBalance,
              byPassWallet: true,
            };
            context.data = { ...data, ...additionalOrderDetails };
            // return ResponseData;
          }
          // else {
          // }
          // }

          // return Promise.resolve(
          //   successMessage(
          //     verifyResponse,
          //     "Your donation has been received successfully"
          //   )
          // );
        } else {
          return Promise.reject(
            new BadRequest(
              "Unable to determine payment status. please contact admin"
            )
          );
        }

        // resolve(successResp(data));
      } else {
        console.log(verifyResponse, "body..........");
        // reject(failedResp(message));
        // const notfound = new BadRequest(message);

        // return Promise.reject(errorMessage(message));
        return Promise.reject(new BadRequest(message));
      }
    } else if (paymentMethod === "wallet") {
      // const { account_balance } = sequelize.models;
      // let loggedInUserId = params?.user?.id;
      // debugger;
      // return Promise.reject(params);
      // console.log(loggedInUserId, "loggedInUserIds");
      const accountBalance = await account_balance.findOne({
        where: {
          userId: loggedInUserId,
          deletedAt: null,
        },
      });
      // console.log(accountBalance, "submissionData");
      if (accountBalance !== null) {
        console.log(accountBalance, "accountBalance");
        const { balance } = accountBalance;
        const { amountToPay: amount } = data; // use the applied discounted amount from coupon validation
        if (amount > balance) {
          const insufficient = new BadRequest(
            "Insufficient balance , please top up your account"
          );
          return Promise.reject(insufficient);
        }
        let additionalOrderDetails = {
          availableBalance: balance,
        };
        context.data = { ...data, ...additionalOrderDetails };
      } else {
        const notFound = new BadRequest(
          "Can not complete request, please check your user account"
        );
        return Promise.reject(notFound);
      }
    }

    return context;
  };
};
const validateMobileNumber = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    const { phoneNumber } = data;
    let cleanedUpPhoneNumber = phoneNumber?.replace(/[^+\d]+/g, "");
    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/); // if phoneNumber // is empty return false
    if (cleanedUpPhoneNumber == null) {
      const error = new BadRequest(
        "Invalid mobile Number , Please check and try again "
      );
      return Promise.reject(error);
    } // Return true if the phoneNumber // matched the ReGex
    if (regex.test(cleanedUpPhoneNumber) == false) {
      const error = new BadRequest(
        "Invalid mobile Number , Please check and try again "
      );
      return Promise.reject(error);
    }

    let additionalOrderDetails = {
      phoneNumber: cleanedUpPhoneNumber,
      uniqueTransIdentity: cleanedUpPhoneNumber,
    };
    context.data = { ...data, ...additionalOrderDetails };

    return context;
  };
};
const debitUserAccount = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");

    const { account_balance } = sequelize.models;
    console.log(data, "data");
    const { amountToPay: amount, paymentMethod } = data;
    if (paymentMethod === "paystack") {
      return context;
    }
    let loggedInUserId = params?.user?.id;
    console.log(loggedInUserId, "loggedInUserId");
    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUserId,
      },
    });

    if (account_balanceDetails !== null) {
      let availableBalance = account_balanceDetails?.balance;
      let currentBalance = parseFloat(availableBalance) - amount;
      console.log(currentBalance, "currentBalance");
      let walletId = account_balanceDetails?.id;
      let Update_payload = {
        balance: currentBalance,
      };
      console.log(Update_payload, "Update_payload....ppppp");
      app.service("account-balance").patch(walletId, Update_payload);
    } else {
      return Promise.reject(new BadRequest("Unable to complete your request"));
    }

    return context;
  };
};
const logErrorToDb = (options = {}) => {
  return async (context) => {
    try {
      const { app, method, result, params, data, id, error } = context;
      // console.log(error, "errormmmmmmm");
      Sentry.captureException(error);
      const sequelize = app.get("sequelizeClient");
      const { account_balance } = sequelize.models;
      let amount = data?.amount;
      let loggedInUserId = params?.user?.id;
      const errorLogs = {
        userId: loggedInUserId,
        amount: amount || 0,
        error: JSON.stringify(error),
        userData: JSON.stringify(data),
      };
      // pushSlackNotification(errorLogs, "error");

      // app.service("transaction-error-logs").create(errorLogs);

      return context;
    } catch (err) {
      Sentry.captureException(err);

      // Handle the error here if necessary
      // console.error(err);
      // throw err; // Re-throw the error to be caught by the global error handler
    }
  };
};
const recordUserCashBack = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    console.log(result, "resultkkkkkkkk");
    const { account_balance, payment_list, payment_providers } =
      sequelize.models;
    const { amount, productId } = data;
    const { provider } = result;
    console.log(data, "..........");
    let loggedInUserId = params?.user?.id;
    let transactionsHistoryId = result?.id;

    const userAccountBalance = await getUserAccountBalanceInfo(
      account_balance,
      loggedInUserId
    );
    console.log(userAccountBalance, "userAccountBalance");
    if (userAccountBalance != false) {
      let cashBackBalance = userAccountBalance?.cashBackBalance || 0;
      // const paymentListDetails = await payment_list.findOne({
      //   where: {
      //     deletedAt: null,
      //     id: productId,
      //   },
      // });
      // const PaymentProvidersDetails = await payment_providers.findOne({
      //   where: {
      //     deletedAt: null,
      //     provider: provider,
      //   },
      // });
      const PaymentProvidersDetails = await getSingleProvidersV2(
        payment_providers,
        provider,
        productId
      );
      if (PaymentProvidersDetails !== null) {
        console.log(PaymentProvidersDetails, "PaymentProvidersDetails");
        let percentageToGiveback = PaymentProvidersDetails?.cashBackPercentage;
        let userPurchaseAmount = convertToNaira(amount);
        let cashBackAmount = (percentageToGiveback / 100) * userPurchaseAmount;
        // let cashBackAmount = 90;
        console.log(cashBackAmount, "cashBackAmount.......befpre ");
        cashBackAmount = parseFloat(cashBackAmount);
        console.log(cashBackAmount, "cashBackAmount.......");
        let newCashBackAmount =
          parseFloat(convertToKobo(cashBackAmount)) +
          parseFloat(cashBackBalance);
        let walletId = userAccountBalance?.id;

        //////////////////////

        const cashBackData = {
          userId: loggedInUserId,
          amount: convertToNaira(amount),
          amountBefore: convertToNaira(cashBackBalance),
          amountAfter: convertToNaira(newCashBackAmount),
          cashBackAmount: cashBackAmount,
          productId: productId,
          transactionsHistoryId: transactionsHistoryId || 0,
          metaData: JSON.stringify(data),
        };

        app.service("cashBack/reward-user").create(cashBackData);

        ///////////////////////////////////
        let Update_payload = {
          cashBackBalance: newCashBackAmount,
        };
        var condition = {
          where: {
            id: walletId,
            deletedAt: null,
          },
        };
        await account_balance.update(Update_payload, condition);
      } else {
        let errorMessage =
          "Unable to record cash back for customer. Payment provider details not set";
        pushSlackNotification(errorMessage, "error");
      }
    }

    return context;
  };
};
const recordQuickBeneficiary = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { quick_beneficiary, payment_providers, providers } =
      sequelize.models;
    const {
      amount,
      productId,
      saveBeneficiary,
      beneficiaryAlias = "No Name",
      uniqueTransIdentity,
      provider,
    } = data;
    let paymentProviders = await getAllProvidersV2(providers);
    let providerDetails = getProviderSourceImage(paymentProviders, provider);
    console.log(data, "data....");
    console.log(providerDetails, "providerDetails");
    let loggedInUserId = params?.user?.id;
    let providerImage = providerDetails?.image || "";
    if (
      saveBeneficiary &&
      saveBeneficiary === true &&
      beneficiaryAlias &&
      beneficiaryAlias != ""
    ) {
      const quickBeneficiaryList = await quick_beneficiary.findOne({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
          productListId: productId,
          uniqueNumber: uniqueTransIdentity,
        },
      });
      if (quickBeneficiaryList === null) {
        const keysToRemove = ["userPin"];
        const sanitizedData = removeSensitiveKeys(data, keysToRemove);
        const quickBeneficiaryData = {
          userId: loggedInUserId,
          sourceImage: providerImage,
          nameAlias: beneficiaryAlias,
          productListId: productId,
          metaData: JSON.stringify(sanitizedData),
          uniqueNumber: uniqueTransIdentity,
        };
        app.service("user/quick-beneficiary").create(quickBeneficiaryData);
      }
    }

    return context;
  };
};
const includeBillDetails = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { product_list, providers } = sequelize.models;
    params.sequelize = {
      include: [
        {
          model: product_list,
          attributes: ["productName", "slug", "image"],
          include: [
            {
              model: providers,
              as: "provider", // Use the same alias you defined in the association
              attributes: ["productName", "slug", "image", "id"],
            },
          ],
        },
      ],
      raw: false,
    };

    return context;
  };
};
const FormatResponseProfile = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    console.log(result, "heheheh");
    // context.result = successMessage(result, "Account verified successfully");
    // return context;
  };
};

const validateTransactionPin = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    const { users } = sequelize.models;
    let loggedInUserId = params?.user?.id;
    const { userPin } = data;
    const userDetails = await users.findOne({
      where: {
        id: loggedInUserId,
        deletedAt: null,
      },
    });
    if (userDetails !== null) {
      const { securityPin } = userDetails;
      if (securityPin === null) {
        const insufficient = new BadRequest(
          "Transaction Pin. please set it and try again "
        );
        return Promise.reject(insufficient);
      }

      let userPinCorrect = await compareHashData(userPin, securityPin);
      if (!userPinCorrect) {
        return Promise.reject(new BadRequest("Incorrect Transaction Pin"));
      }
    } else {
      const notFound = new BadRequest(
        "Can not complete request, please contact support..."
      );
      return Promise.reject(notFound);
    }

    return context;
  };
};
const getAllProviders = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { payment_providers, payment_list } = sequelize.models;
    // const {
    //   amount,
    //   productId,
    //   saveBeneficiary,
    //   beneficiaryAlias,
    //   uniqueTransIdentity,
    //   provider,
    // } = data;

    const paymentProvidersList = await payment_providers.findAll({
      where: {
        deletedAt: null,
      },
    });
    let paymentProviders = paymentProvidersList || [];
    paymentProviders = JSON.stringify(paymentProviders);
    paymentProviders = JSON.parse(paymentProviders);

    let additionalOrderDetails = {
      paymentProviders: paymentProviders,
    };

    context.data = { ...context.data, ...additionalOrderDetails };

    return context;
  };
};

const getAllProvidersV2 = async (providers) => {
  const paymentProvidersList = await providers.findAll({
    where: {
      deletedAt: null,
    },
  });
  let paymentProviders = paymentProvidersList || [];
  paymentProviders = JSON.stringify(paymentProviders);
  paymentProviders = JSON.parse(paymentProviders);
  return paymentProviders;
};
const getSingleProvidersV2 = async (providers, provider, productId) => {
  const PaymentProvidersDetails = await providers.findOne({
    where: {
      deletedAt: null,
      provider: provider,
      productId: productId,
    },
  });
  // let paymentProviders = paymentProvidersList || [];
  // paymentProviders = JSON.stringify(paymentProviders);
  // paymentProviders = JSON.parse(paymentProviders);
  return PaymentProvidersDetails;
};
const scheduleUserPayment = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { quick_beneficiary, payment_providers, providers } =
      sequelize.models;

    console.log(result, "result");
    console.log(data, "data");
    let loggedInUserId = params?.user?.id;

    const {
      amount,
      productId,
      // saveBeneficiary,
      // beneficiaryAlias = "No Name",
      // uniqueTransIdentity,
      // provider,
      scheduleBill,
      dayOfWeek,
      frequency,
      dayOfMonth,
    } = data;
    if (!scheduleBill) {
      return context;
    }
    const { scheduleMeta } = result;
    let lastExecution = null;
    let nextDateData = {
      frequency,
      dayOfWeekString: dayOfWeek,
      dayOfMonth,
      lastExecution,
    };
    const nextExecutionDate = calculateBillNextExecutionDate(nextDateData);
    const scheduledPayment = {
      userId: loggedInUserId,
      frequency: frequency, // Replace with the desired frequency
      dayOfWeek: dayOfWeek, // Replace with the desired day of the week (0-6 for Sunday to Saturday)
      dayOfMonth: dayOfMonth, // Replace with the desired day of the month (1-31)
      PaymentMetaData: JSON.stringify(scheduleMeta),
      productListId: productId,
      lastExecution: lastExecution, // Replace with the last execution date and time
      nextExecution: nextExecutionDate,
      purchaseAmount: amount,
    };

    app
      .service("schedulePayment/schedule-bills-payment")
      .create(scheduledPayment);
    return context;
  };
};

const FormatMobileNumber = (options = {}) => {
  return async (context) => {
    const { data } = context;
    let { phoneNumber } = data;

    if (!phoneNumber) {
      throw new BadRequest("Phone number is required");
    }

    // If phoneNumber is an array, process each number individually
    if (Array.isArray(phoneNumber)) {
      const formattedPhoneNumbers = phoneNumber.map((number) => {
        return formatSinglePhoneNumber(number);
      });

      // Update the context's phoneNumber property with the formatted array
      context.data.phoneNumber = formattedPhoneNumbers;
    } else {
      // If phoneNumber is a single number, process it
      context.data.phoneNumber = formatSinglePhoneNumber(phoneNumber);
    }

    return context;
  };
};

function formatSinglePhoneNumber(phoneNumber) {
  // Remove non-digit characters from the phone number
  let cleanedUpPhoneNumber = phoneNumber.replace(/[^+\d]+/g, "");

  // Check if the cleaned phone number starts with a country code
  if (!cleanedUpPhoneNumber.startsWith("+")) {
    // Assuming a default country code (e.g., +234 for Nigeria)
    cleanedUpPhoneNumber = cleanedUpPhoneNumber.replace(/^0+/, "");

    const defaultCountryCode = "+234"; // Replace with your desired default country code
    phoneNumber = defaultCountryCode + cleanedUpPhoneNumber;
  }

  // Validate the remaining digits (excluding the country code)
  const regex = /^(?:\+\d{1,3})?\d{10}$/; // Allow an optional country code and exactly 10 digits
  if (!regex.test(phoneNumber)) {
    throw new BadRequest("Invalid mobile number format");
  }

  return phoneNumber;
}
const includePaymentDetailsDetails = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { product_list, providers } = sequelize.models;
    params.sequelize = {
      include: [
        {
          model: product_list,
          attributes: ["productName", "slug", "image"],
          include: [
            {
              model: providers,
              as: "provider", // Use the same alias you defined in the association
              attributes: ["productName", "slug", "image", "id"],
            },
          ],
        },
      ],
      raw: false,
    };

    return context;
  };
};
const addToFavoriteRecharge = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { user_favourite_recharge, payment_providers, providers } =
      sequelize.models;
    const {
      amount,
      productId,
      addToFavorite,
      beneficiaryAlias = "No Name",
      uniqueTransIdentity,
      provider,
      name,
    } = data;
    let paymentProviders = await getAllProvidersV2(providers);
    let providerDetails = getProviderSourceImage(paymentProviders, provider);
    console.log(data, "data....");
    console.log(providerDetails, "providerDetails");
    let loggedInUserId = params?.user?.id;
    let providerImage = providerDetails?.image || "";
    let productName = "";
    let amountInNaira = convertToNaira(amount);
    if (!name) {
      productName = `${providerDetails?.productName} Airtime`;
    } else {
      productName = name;
    }
    if (addToFavorite) {
      const isAddedToFavorite = await user_favourite_recharge.findOne({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
          productListId: productId,
          uniqueNumber: uniqueTransIdentity,
          nameAlias: productName,
          amount: amountInNaira,
        },
      });
      // const isAddedToFavorite = null;
      if (isAddedToFavorite == null) {
        const keysToRemove = [
          "userPin",
          "saveBeneficiary",
          "scheduleBill",
          "uniqueTransIdentity",
          "availableBalance",
          "frequency",
          "dayOfMonth",
          "dayOfWeek",
        ];

        const sanitizedData = removeSensitiveKeys(data, keysToRemove);
        const userFavoriteRecharge = {
          userId: loggedInUserId,
          sourceImage: providerImage,
          nameAlias: productName,
          productListId: productId,
          metaData: JSON.stringify(sanitizedData),
          uniqueNumber: uniqueTransIdentity,
          amount: amountInNaira,
        };
        app.service("user-favourite-recharge").create(userFavoriteRecharge);
      }
    }
    return context;
  };
};
const sendResultBackToFrontEnd = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const { message } = options;
    const sequelize = app.get("sequelizeClient");
    const responseResult = context.result;
    context.result = successMessage(responseResult, message);
    return context;
  };
};

module.exports = {
  checkAvailableBalance,
  debitUserAccount,
  validateMobileNumber,
  logErrorToDb,
  recordUserCashBack,
  recordQuickBeneficiary,
  includeBillDetails,
  getAllProviders,
  validateTransactionPin,
  getAllProvidersV2,
  getSingleProvidersV2,
  scheduleUserPayment,
  FormatMobileNumber,
  includePaymentDetailsDetails,
  addToFavoriteRecharge,
  sendResultBackToFrontEnd,
};
