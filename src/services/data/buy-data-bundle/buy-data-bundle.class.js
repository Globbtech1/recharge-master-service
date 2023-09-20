/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  convertToNaira,
  ShowCurrentDate,
} = require("../../../dependency/UtilityFunctions");
const { pushSlackNotification } = require("../../../hooks/general-uses");
const { DataPurchase } = require("../../../interfaces/dataPurchase");
const logger = require("../../../logger");
exports.BuyDataBundle = class BuyDataBundle {
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
    console.log(data, "please");

    const sequelize = this.app.get("sequelizeClient");
    // const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const {
      phoneNumber,
      amount,
      provider,
      fundSource,
      availableBalance,
      paymentId,
      dataCode,
      name,
    } = data;
    let loggedInUserId = params?.user?.id;
    try {
      //TODO futher check if the price coming is the same as the price of the bundle
      // data = { ...data, amount: dataAmount };
      let dataPurchase = new DataPurchase();
      let dataPurchasePaymentResponse = await dataPurchase.buyDataPlans(data);
      console.log(dataPurchasePaymentResponse, "dataPurchasePaymentResponse");
      let providerStatus = dataPurchasePaymentResponse?.status;
      if (providerStatus != "success") {
        console.log("in Error Block");
        let metaData = {
          "Transaction ID": "nill",
          "Phone Number": phoneNumber,
          "Network Provider": provider.toUpperCase(),
          "Data Bundle": name,
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
        // TODO we need to be sure the provider is not given the user the value.
        // TODO this side need to be tested properly on live
      }
      let newBalance = parseFloat(availableBalance) - parseFloat(amount);
      let transactionReference = dataPurchasePaymentResponse?.reference;
      let metaData = {
        "Transaction ID": transactionReference,
        "Phone Number": phoneNumber,
        "Network Provider": provider?.toUpperCase(),
        "Data Bundle": name,
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

      // return Promise.resolve(
      //   successMessage(
      //     dataPurchasePaymentResponse,
      //     CONSTANT.successMessage.airtimePurchase
      //   )
      // );
      let additionalOrderDetails = {
        slackNotificationData: dataPurchasePaymentResponse,
      };
      responseTransaction = {
        ...responseTransaction,
        ...additionalOrderDetails,
      };

      return responseTransaction;
    } catch (error) {
      let errorMessage =
        error?.response?.data?.error?.message ||
        "Unable to process your request";
      console.error("An error occurred: ", error.message);
      pushSlackNotification(error?.response?.data, "error");
      logger.error("error", error);
      let metaData = {
        "Transaction ID": "nill",
        "Phone Number": phoneNumber,
        "Network Provider": provider.toUpperCase(),
        "Data Bundle": name,
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
