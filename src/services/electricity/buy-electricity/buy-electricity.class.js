const { BadRequest } = require("@feathersjs/errors");
const {
  ElectricityPurchase,
} = require("../../../interfaces/electricityPurchase");
const { CONSTANT } = require("../../../dependency/Config");
const {
  convertToNaira,
  ShowCurrentDate,
  successMessage,
} = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.BuyElectricity = class BuyElectricity {
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
    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const {
      phoneNumber,
      meterNumber,
      amount,
      provider,
      fundSource,
      availableBalance,
      paymentId,
    } = data;
    let loggedInUserId = params?.user?.id;
    try {
      const electricityPurchase = new ElectricityPurchase();
      let electricityPurchaseResponse =
        await electricityPurchase.purchaseElectricityUnits(data);
      let purchaseStatus =
        electricityPurchaseResponse?.providerMessage.toLowerCase() ===
        `topup successful on ${meterNumber}`;
      // console.log(
      //   electricityPurchaseResponse,
      //   purchaseStatus,
      //   "electricityPurchaseResponse"
      // );

      if (!purchaseStatus) {
        console.log("in Error Block");
        let metaData = {
          "Transaction ID": "nill",
          "Phone Number": phoneNumber,
          "Electricity Provider": provider.toUpperCase(),
          "Meter Number": meterNumber,
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
          productId: paymentId,
          transactionDate: ShowCurrentDate(),
          amount: convertToNaira(amount),
          transactionStatus: CONSTANT.transactionStatus.failed,
          paidBy: fundSource,
        };
        this.app.service("transactions-history").create(transactionHistory);

        return Promise.reject(
          new BadRequest("Transaction was not successful, please try again.")
        );
      }

      let newBalance = parseFloat(availableBalance) - parseFloat(amount);
      let transactionReference =
        electricityPurchaseResponse?.transactionReference;
      let metaData = {
        "Transaction ID": transactionReference,
        "Phone Number": phoneNumber,
        "Electricity Provider": provider.toUpperCase(),
        "Meter Number": meterNumber,
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
        productId: paymentId,
        transactionDate: ShowCurrentDate(),
        amount: convertToNaira(amount),
        transactionStatus: CONSTANT.transactionStatus.success,
        paidBy: fundSource,
      };
      let responseTransaction = await this.app
        .service("transactions-history")
        .create(transactionHistory);

      let additionalOrderDetails = {
        slackNotificationData: electricityPurchaseResponse,
      };
      responseTransaction = {
        ...responseTransaction,
        ...additionalOrderDetails,
      };
      // console.log({ ...electricityPurchaseResponse, responseTransaction });
      return Promise.resolve(
        successMessage(
          electricityPurchaseResponse,
          "Electricity units purchased successfully"
        )
      );
    } catch (error) {
      let errorMessage =
        error?.response?.data?.error?.message ||
        "Unable to process your request";

      console.error("An error occurred: ", error.message);

      let metaData = {
        "Transaction ID": transactionReference,
        "Phone Number": phoneNumber,
        "Electricity Provider": provider.toUpperCase(),
        "Meter Number": meterNumber,
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
        productId: paymentId,
        transactionDate: ShowCurrentDate(),
        amount: convertToNaira(amount),
        transactionStatus: CONSTANT.transactionStatus.failed,
        paidBy: fundSource,
      };
      this.app.service("transactions-history").create(transactionHistory);
      return Promise.reject(new BadRequest(errorMessage));
    }
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
