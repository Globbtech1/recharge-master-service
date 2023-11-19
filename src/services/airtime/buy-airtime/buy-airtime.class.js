const { BadRequest, NotFound } = require("@feathersjs/errors");
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
const { BaxiIntegration } = require("../../../interfaces/baxiIntegration");

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
    console.log(params, "params");
    const { headers } = params;
    console.log(JSON.stringify(headers), "params");
    // return;
    console.log(data, "please");

    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd, product_list, providers } =
      sequelize.models;
    const {
      phoneNumber,
      amount,
      fundSource = "self",
      availableBalance,
      productId,
    } = data;
    let loggedInUserId = params?.user?.id;

    const productDetails = await product_list.findOne({
      where: {
        deletedAt: null,
        id: productId,
      },
      include: [
        {
          model: providers,
          as: "provider", // Use the same alias you defined in the association
        },
      ],
    });
    if (productDetails === null) {
      const notFound = new NotFound(
        "Product not fund or it currently disabled"
      );
      return Promise.reject(notFound);
    }
    console.log(productDetails, "productDetails");
    const { provider: providerDetails, slug, productName } = productDetails;
    console.log(providerDetails, slug, productName, "productName");
    const { slug: provider } = providerDetails;

    // if (slug === "Data_Plan") {
    //   const headersNN = {
    //     Authorization: `Bearer ${"userToken"}`,
    //   };
    //   return await this.app.service("/data/buy-data-bundle").create(
    //     {
    //       phoneNumber: "07065873900",
    //       amount: "10000",
    //       provider: "mtn",
    //       fundSource: "self",
    //       dataCode: "100",
    //       name: "100MB Daily - Daily",
    //       paymentId: 3,
    //       saveBeneficiary: true,
    //       beneficiaryAlias: "my mtn bun",
    //       userPin: "111111",
    //     },
    //     { ...headers }
    //   );
    // }
    let amountInNaira = convertToNaira(amount);
    let payload = {
      phone: phoneNumber,
      amount: amountInNaira,
      service_type: provider,
      plan: "prepaid",
    };
    // return;
    try {
      let airtimePurchase = new AirtimePurchase();
      let airtimeBaxi = new BaxiIntegration();
      // let airtimePaymentResponse = await airtimePurchase.buyAirtime(payload);
      let airtimePaymentResponse = await airtimeBaxi.buyAirtime(payload);
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
          productListId: productId,
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
        scheduleMeta: payload,
      };
      responseTransaction = {
        ...responseTransaction,
        ...additionalOrderDetails,
        // ...data,
      };

      return responseTransaction;
    } catch (error) {
      console.log(error, "pppppp");
      let errorMessage =
        error?.response?.data?.message || "Unable to process your request";
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
      return Promise.reject(new BadRequest(errorMessage));
    }
  }
};
