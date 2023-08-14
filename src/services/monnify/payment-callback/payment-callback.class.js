const { NotFound } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  errorMessage,
  successMessage,
  convertToKobo,
  convertToNaira,
  ShowCurrentDate,
} = require("../../../dependency/UtilityFunctions");
const { CalculationRequestHash } = require("../../../hooks/general-uses");
const { MonifyIntegration } = require("../../../interfaces/monifyIntegration");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.PaymentCallback = class PaymentCallback {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const { user } = params;
    const { securityNumber, confirmSecurityNumber } = data;
    logger.info("params", params);
    const { headers } = params;
    const monnifyRequestSignature = headers["monnify-signature"];
    console.log(monnifyRequestSignature, "monnifyRequestSignature");
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { generateaccount, account_balance, payment_list } = sequelize.models;

    let stringifiedRequestBody = JSON.stringify(data);
    let hashValue = await CalculationRequestHash(stringifiedRequestBody);
    if (!monnifyRequestSignature || hashValue !== monnifyRequestSignature) {
      Promise.reject(
        errorMessage("Signature does not match ", null, 500)
        // error
      );
      return;
    }
    try {
      let transactionReference = data?.eventData?.transactionReference;
      let dataPay = {
        transactionReference: transactionReference,
      };
      // return;s
      const Monnify = new MonifyIntegration();
      let resp = await Monnify.getTransactionStatus(dataPay);
      const {
        product,
        settlementAmount,
        paymentMethod,
        amountPaid,
        accountDetails,
      } = resp;
      let amountSettled = amountPaid;
      const { reference, type: transactionType } = product;
      console.log(transactionType, "transactionType");
      if (transactionType === CONSTANT.RESERVED_ACCOUNT) {
        const payment_listDetails = await payment_list.findOne({
          where: {
            deletedAt: null,
            slug: CONSTANT.AccountFunding,
          },
        });
        const accountDetailsDetails = await generateaccount.findOne({
          where: {
            deletedAt: null,
            accountReference: reference,
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
            ...accountDetails,
            transactionDate: ShowCurrentDate(),
          };
          let fundingHistory = {
            userId: accountOwnerId,
            paymentType: "credit",
            amountBefore: convertToNaira(availableBalance),
            amountAfter: convertToNaira(currentBalance),
            referenceNumber: transactionReference,
            metaData: JSON.stringify(metaData),
            paymentListId: payment_listDetails?.id || 0,
            transactionDate: ShowCurrentDate(),
            amount: amountPaid,
            transactionStatus: CONSTANT.transactionStatus.success,
            paidBy: "self",
          };
          data = {
            accountFundingData: funding,
            ...data,
            payHistory: fundingHistory,
          };
          return data;
        } else {
        }
      } else if (transactionType === CONSTANT.WEB_SDK) {
        return await confirmPayment(reference, sequelize);
      }

      // return data;
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage("An error Occured while funding user account ", error, 500)
        // error
      );
    }

    // return data;
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
