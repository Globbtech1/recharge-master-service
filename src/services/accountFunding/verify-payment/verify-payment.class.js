const { BadRequest, NotFound } = require("@feathersjs/errors");
const {
  convertToNaira,
  successMessage,
  errorMessage,
  ShowCurrentDate,
  convertToKobo,
} = require("../../../dependency/UtilityFunctions");
const { CONSTANT } = require("../../../dependency/Config");
var paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);
/* eslint-disable no-unused-vars */
exports.VerifyPayment = class VerifyPayment {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    console.log(id);
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { users, fund_innitiator, account_balance, product_list } =
        sequelize.models;

      const paymentDetails = await fund_innitiator.findOne({
        where: {
          deletedAt: null,
          reference: id,
          status: "pending",
        },
        // raw: true,
      });
      if (paymentDetails === null) {
        const notfound = new NotFound("Payment reference not found");
        return Promise.reject(notfound);
      }

      // let paymentId = paymentDetails?.id;
      // const appointmentsDetails = await appointments.findOne({
      //   where: {
      //     deletedAt: null,
      //     paymentId: paymentId,
      //   },
      //   // raw: true,
      // });
      // if (appointmentsDetails === null) {
      //   const notfound = new NotFound("Patient appointments not found");
      //   return Promise.reject(notfound);
      // }

      let verifyResponse = await paystack.transaction.verify(id);
      console.log(verifyResponse, "verifyResponse");
      const { status, data, message } = verifyResponse;
      if (status) {
        console.log(data, "ppppppppppp");
        const {
          status: transactionStatus,
          amount,
          authorization,
          reference,
          channel: paymentMethod,
        } = data;
        console.log(transactionStatus, "pooppoopop");
        if (transactionStatus === CONSTANT.payStackPaymentStatus.success) {
          let nairaAmount = convertToNaira(amount);
          console.log(nairaAmount);
          let amountSettled = nairaAmount;
          let amountPaid = nairaAmount;
          let transactionReference = reference;

          // if (transactionType === CONSTANT.RESERVED_ACCOUNT) {
          const product_listDetails = await product_list.findOne({
            where: {
              deletedAt: null,
              slug: CONSTANT.AccountFunding,
            },
          });
          const accountDetailsDetails = await fund_innitiator.findOne({
            where: {
              deletedAt: null,
              reference: reference,
            },
          });
          if (accountDetailsDetails === null) {
            const notFound = new NotFound("User not found at the moment");
            return Promise.reject(notFound);
          }
          let accountOwnerId = accountDetailsDetails?.userId;
          const account_balanceDetails = await account_balance.findOne({
            where: {
              deletedAt: null,
              userId: accountOwnerId,
            },
          });

          let availableBalance = 0;

          if (account_balanceDetails !== null) {
            availableBalance = account_balanceDetails?.balance;
            let currentBalance =
              parseFloat(availableBalance) +
              parseFloat(convertToKobo(amountSettled));
            let walletId = account_balanceDetails?.id;
            let Update_payload = {
              balance: currentBalance,
            };

            this.app.service("account-balance").patch(walletId, Update_payload);
            this.app
              .service("accountFunding/fund-innitiator")
              .patch(accountDetailsDetails?.id, {
                status: CONSTANT.transactionStatus.success,
              });

            let funding = {
              userId: accountOwnerId,
              amount: amountSettled,
              amountBefore: convertToNaira(availableBalance),
              amountAfter: convertToNaira(currentBalance),
              source: `${paymentMethod} ||| ${transactionReference}`,
            };
            let metaData = {
              amount: amountPaid,
              paymentMethod: paymentMethod,
              // ...accountDetails,
              transactionDate: ShowCurrentDate(),
            };
            let fundingHistory = {
              userId: accountOwnerId,
              paymentType: "credit",
              amountBefore: convertToNaira(availableBalance),
              amountAfter: convertToNaira(currentBalance),
              referenceNumber: transactionReference,
              metaData: JSON.stringify(metaData),
              productListId: product_listDetails?.id || 0,
              transactionDate: ShowCurrentDate(),
              amount: amountPaid,
              transactionStatus: CONSTANT.transactionStatus.success,
              paidBy: "self",
            };
            let ResponseData = {
              accountFundingData: funding,
              ...data,
              payHistory: fundingHistory,
            };
            return ResponseData;
          }
          // else {
          // }
          // }

          return Promise.resolve(
            successMessage(
              verifyResponse,
              "Your donation has been received successfully"
            )
          );
        } else {
          return Promise.reject(
            new Error(
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
        return Promise.reject(new Error(message));
      }
    } catch (error) {
      console.log(error, "error");
      const notfound = new BadRequest(error);
      return Promise.reject(new Error(error));
      // return Promise.reject(notfound);
    }
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
};
