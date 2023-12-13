/* eslint-disable no-unused-vars */
const { BadRequest, NotFound } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  convertToNaira,
  ShowCurrentDate,
} = require("../../../dependency/UtilityFunctions");
const { pushSlackNotification } = require("../../../hooks/general-uses");
const { DataPurchase } = require("../../../interfaces/dataPurchase");
const logger = require("../../../logger");
const { BaxiIntegration } = require("../../../interfaces/baxiIntegration");
const { customLog } = require("../../../dependency/customLoggers");
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
    let paidByPhoneNumber = params?.user?.phoneNumber;

    const sequelize = this.app.get("sequelizeClient");
    // const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const { users, initiate_reset_pwd, product_list, providers } =
      sequelize.models;
    const {
      phoneNumber,
      amount,
      // provider,
      fundSource = "self",
      availableBalance,
      // paymentId,
      dataCode,
      name,
      productId,
      productAmount,
      amountToPay, // this will be minus  the discounted value  if applicable
      paymentMethod,
      platform = "auto",
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
    customLog(productDetails, "productDetails");
    const { provider: providerDetails, slug, productName } = productDetails;
    console.log(providerDetails, slug, productName, "productName");
    const { slug: provider } = providerDetails;

    //TODO futher check if the price coming is the same as the price of the bundle
    // data = { ...data, amount: dataAmount };
    let amountInNaira = convertToNaira(amount);
    let payload = {
      phone: phoneNumber,
      amount: amountInNaira,
      service_type: provider,
      datacode: dataCode,
    };

    try {
      let baxiService = new BaxiIntegration();
      let dataPurchasePaymentResponse = await baxiService.buyDataPlans(payload);
      console.log(dataPurchasePaymentResponse, "dataPurchasePaymentResponse");
      let providerStatus = dataPurchasePaymentResponse?.status;
      if (providerStatus != "success") {
        console.log("in Error Block");
        let metaData = {
          "Transaction ID": "nill",
          "Phone Number": phoneNumber,
          "Network Provider": provider.toUpperCase(),
          "Data Bundle": name,
          // "Paid By": fundSource,
          "Paid By": paidByPhoneNumber,
          Date: ShowCurrentDate(),
          Amount: convertToNaira(amount),
          paymentMethod: paymentMethod,
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
          // paidBy: fundSource,
          paidBy: paidByPhoneNumber,
          paymentMethod: paymentMethod,
          transactionType: CONSTANT.transactionType.data,
          platform: platform,
        };
        this.app.service("transactions-history").create(transactionHistory);

        return Promise.reject(
          new BadRequest("Transaction was not successful, please try again.")
        );
        // TODO we need to be sure the provider is not given the user the value.
        // TODO this side need to be tested properly on live
      }
      // let newBalance = parseFloat(availableBalance) - parseFloat(amountToPay);
      let newBalance = 0;
      if (paymentMethod === "paystack") {
        newBalance = parseFloat(availableBalance);
      } else if (paymentMethod === "wallet") {
        newBalance = parseFloat(availableBalance) - parseFloat(amountToPay);
      }

      let transactionReference =
        dataPurchasePaymentResponse?.reference ||
        dataPurchasePaymentResponse?.transactionReference;
      let metaData = {
        "Transaction ID": transactionReference,
        "Phone Number": phoneNumber,
        "Network Provider": provider?.toUpperCase(),
        "Data Bundle": name,
        // "Paid By": fundSource,
        "Paid By": paidByPhoneNumber,
        Date: ShowCurrentDate(),
        Amount: convertToNaira(amount),
        amountPaid: convertToNaira(amountToPay),
        paymentMethod: paymentMethod,
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
        amountPaid: convertToNaira(amountToPay),
        transactionStatus: CONSTANT.transactionStatus.success,
        // paidBy: fundSource,
        paidBy: paidByPhoneNumber,
        paymentMethod: paymentMethod,
        transactionType: CONSTANT.transactionType.airtime,
        platform: platform,
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
        provider,
        scheduleMeta: payload,
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
        // "Paid By": fundSource,
        "Paid By": paidByPhoneNumber,
        Date: ShowCurrentDate(),
        Amount: convertToNaira(amount),
        amountPaid: convertToNaira(0),
        Status: CONSTANT.transactionStatus.failed,
        paymentMethod: paymentMethod,
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
        amountPaid: convertToNaira(0),
        transactionStatus: CONSTANT.transactionStatus.failed,
        // paidBy: fundSource,
        paidBy: paidByPhoneNumber,
        paymentMethod: paymentMethod,
        transactionType: CONSTANT.transactionType.data,
        platform: platform,
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
