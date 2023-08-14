/* eslint-disable no-unused-vars */
const {
  successMessage,
  ShowCurrentDate,
  convertToNaira,
} = require("../../../../dependency/UtilityFunctions");
const { BadRequest, BadGateway } = require("@feathersjs/errors");
const logger = require("../../../../logger");
const {
  TvSubscription: BuyTvSubscription,
} = require("../../../../interfaces/tvSubscription");
const { CONSTANT } = require("../../../../dependency/Config");
const {
  MonifyIntegration,
} = require("../../../../interfaces/monifyIntegration");

exports.TvSubscription = class TvSubscription {
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
    const {
      provider,
      amount,
      decoderNumber,
      productMonthsPaidFor,
      paymentId,
      bouquet,
    } = data;
    let payload = {
      ...data,
      transactionType: CONSTANT?.monnifyBillTypes?.television,
    };
    let amountInNaira = convertToNaira(amount);
    try {
      if (!payload?.email) {
        payload.email = "anonymous@mail.com";
      }
      payload.amount = amountInNaira;
      const validationPayload = {
        provider,
        amount,
        productMonthsPaidFor,
        bouquet,
      };

      const tvSubscription = new BuyTvSubscription();

      // VALIDATE PAYMENT PRICE
      const { monthsPaidFor, price, invoicePeriod } =
        await tvSubscription.validateTvSubscriptionPrice(validationPayload);

      // if (price != amountInNaira) {
      //   return Promise.reject(
      //     new BadRequest("Enter valid subscription amount")
      //   );
      // }
      // return { amountInNaira, price };
      if (+amountInNaira < price) {
        return Promise.reject(
          new BadRequest(
            "Amount can not be less than actual subscription amount"
          )
        );
      }

      // monnify
      const monnify = new MonifyIntegration();
      const monnifyResponse = await monnify.generatePaymentLink(payload);
      delete monnifyResponse?.apiKey
      delete monnifyResponse?.merchantName
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
      logger.error("error", error);
      const parsedError = JSON.parse(JSON.stringify(error));
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
