/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const {
  ElectricityPurchase,
} = require("../../../../interfaces/electricityPurchase");
const { CONSTANT } = require("../../../../dependency/Config");
const {
  convertToNaira,
  ShowCurrentDate,
  successMessage,
} = require("../../../../dependency/UtilityFunctions");
const {
  MonifyIntegration,
} = require("../../../../interfaces/monifyIntegration");

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
    const { guest_purchases } = sequelize.models;
    const { amount, paymentId } = data;
    let amountInNaira = convertToNaira(amount);
    let payload = {
      ...data,
      amount: amountInNaira,
      transactionType: CONSTANT?.monnifyBillTypes?.electricity,
    };
    try {
      if (!payload?.email) {
        payload.email = "anonymous@mail.com";
      }
      const monnify = new MonifyIntegration();
      const monnifyResponse = await monnify.generatePaymentLink(payload);
      delete monnifyResponse?.apiKey;
      delete monnifyResponse?.merchantName;
      const purchase = await guest_purchases.create({
        amount: amountInNaira,
        referenceNumber: monnifyResponse?.paymentReference,
        monnifyReference: monnifyResponse?.transactionReference,
        metaData: JSON.stringify({ ...payload, ...monnifyResponse }),
        paymentListId: paymentId,
        transactionDate: new Date(),
        transactionStatus: "Pending",
      });
      return Promise.resolve(
        successMessage(
          {
            amount,
            checkoutUrl: monnifyResponse?.checkoutUrl,
            referenceNumber: monnifyResponse?.referenceNumber,
            monnifyReference: monnifyResponse?.monnifyReference,
            purchase,
          },
          "Click on the link to pay"
        )
      );
    } catch (error) {
      let errorMessage =
        error?.response?.data?.error?.message ||
        "Unable to process your request";

      console.error("An error occurred: ", error.message);
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
