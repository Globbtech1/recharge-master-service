const { BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  ShowCurrentDate,
  convertToNaira,
  convertToKobo,
} = require("../../../dependency/UtilityFunctions");
const { pushSlackNotification } = require("../../../hooks/general-uses");
const { AirtimePurchase } = require("../../../interfaces/airtimePurchase");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.BuyAirtime = class BuyAirtime {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async create(data, params) {
    console.log(data, "please");

    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const {
      phoneNumber,
      amount,
      provider,
      fundSource,
      availableBalance,
      paymentId,
    } = data;
    let loggedInUserId = params?.user?.id;

    try {
      let airtimePurchase = new AirtimePurchase();
      let airtimePaymentResponse = await airtimePurchase.buyAirtime(data);
      console.log(airtimePaymentResponse, "airtimePaymentResponse");
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
          paymentListId: paymentId,
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
        paymentListId: paymentId,
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
        paymentListId: paymentId,
        transactionDate: ShowCurrentDate(),
        amount: convertToNaira(amount),
        transactionStatus: CONSTANT.transactionStatus.failed,
        paidBy: fundSource,
      };
      this.app.service("transactions-history").create(transactionHistory);
      return Promise.reject(new BadRequest(errorMessage));
    }
  }
};
