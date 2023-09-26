/* eslint-disable no-unused-vars */
const {
  successMessage,
  ShowCurrentDate,
  convertToNaira,
} = require("../../../dependency/UtilityFunctions");
const { BadRequest, BadGateway } = require("@feathersjs/errors");
const logger = require("../../../logger");
const { TvSubscription } = require("../../../interfaces/tvSubscription");
const { CONSTANT } = require("../../../dependency/Config");
exports.BuyTvSubscription = class BuyTvSubscription {
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
    const {
      provider,
      availableBalance,
      amount,
      decoderNumber,
      productMonthsPaidFor,
      paymentId,
      fundSource,
      bouquet,
    } = data;
    let loggedInUserId = user?.id;
    let error;
    try {
      const validationPayload = {
        provider,
        amount,
        productMonthsPaidFor,
        bouquet,
      };
      const payload = {
        service_type: provider,
        total_amount: amount,
        isBoxOffice: false,
        smartcard_number: decoderNumber,
        product_monthsPaidFor: productMonthsPaidFor,
      };

      const tvSubscription = new TvSubscription();

      // VALIDATE PAYMENT PRICE
      const { monthsPaidFor, price, invoicePeriod } =
        await tvSubscription.validateTvSubscriptionPrice(validationPayload);
      if (price != convertToNaira(amount)) {
        return Promise.reject(
          new BadRequest("Enter valid subscription amount")
        );
      }
      // return { monthsPaidFor, price, invoicePeriod };

      // TV SUBSCRIPTION LOGIC
      const tvSubPurchaseResponse = await tvSubscription.buyTvSubscription(
        payload
      );
      let purchaseStatus =
        tvSubPurchaseResponse?.transactionStatus.toLowerCase() === `success`;
      console.log(tvSubPurchaseResponse, "tvResponse");

      if (!purchaseStatus) {
        console.log("in Error Block");
        let metaData = {
          "Transaction ID": "nill",
          "TV Provider": provider.toUpperCase(),
          "Decoder Number": data?.decoderNumber,
          "Paid By": data?.fundSource,
          Date: ShowCurrentDate(),
          Amount: convertToNaira(data?.amount),
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
          amount: convertToNaira(data?.amount),
          transactionStatus: CONSTANT.transactionStatus.failed,
          paidBy: fundSource,
        };
        this.app.service("transactions-history").create(transactionHistory);

        return Promise.reject(
          new BadRequest("Transaction was not successful, please try again.")
        );
      }
      // console.log("Got here 1");

      let newBalance = parseFloat(availableBalance) - parseFloat(amount);
      let transactionReference = tvSubPurchaseResponse?.transactionReference;
      let metaData = {
        "Transaction ID": transactionReference,
        "TV Provider": provider.toUpperCase(),
        "Decoder Number": decoderNumber,
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
      // console.log("Got here 2");

      let responseTransaction = await this.app
        .service("transactions-history")
        .create(transactionHistory);

      let additionalOrderDetails = {
        slackNotificationData: tvSubPurchaseResponse,
      };
      responseTransaction = {
        ...responseTransaction,
        ...additionalOrderDetails,
      };

      // console.log("Got here 3");
      // return { message: "hello", tvSubPurchaseResponse, responseTransaction };

      return Promise.resolve(
        successMessage(tvSubPurchaseResponse, "TV subscription successful")
      );
    } catch (error) {
      logger.error("error", error);
      const parsedError = JSON.parse(JSON.stringify(error));
      // console.log(
      //   "statusCodes",
      //   parsedError
      // );
      if (parsedError?.status === 503) {
        return Promise.reject(
          new BadGateway("Service currently not available")
        );
      }
      return Promise.reject(new BadRequest("Unable to subscribe for tv"));
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
