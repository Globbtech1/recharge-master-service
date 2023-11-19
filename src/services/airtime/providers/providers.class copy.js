const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const { getAllProvidersV2 } = require("../../../hooks/billPayment.hook");
const { AirtimePurchase } = require("../../../interfaces/airtimePurchase");
const logger = require("../../../logger");
const Sentry = require("@sentry/node");
const { BaxiIntegration } = require("../../../interfaces/baxiIntegration");

// const { BaxiIntegration } =
//   require("../../../interfaces/baxiIntegration").BaxiIntegration;

/* eslint-disable no-unused-vars */
exports.Providers = class Providers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { query } = params;
      // abiodunff;
      const { payment_providers } = sequelize.models;
      const paymentId = query?.paymentId || 0;
      if (paymentId === 0) {
        return Promise.reject(new BadRequest("Payment Id is required"));
      }
      // console.log(params, "params???");
      // const paymentProvidersList = await payment_providers.findAll({
      //   where: {
      //     deletedAt: null,
      //   },
      // });
      // let paymentProviders = paymentProvidersList || [];
      // paymentProviders = JSON.stringify(paymentProviders);
      // paymentProviders = JSON.parse(paymentProviders);

      // const { data } = params;
      // const { paymentProviders } = data;
      // console.log(params, "paymentProviders");
      let paymentProviders = await getAllProvidersV2(payment_providers);
      let airtimePurchase = new AirtimePurchase();
      // let airtimeProviders = await airtimePurchase.getProviderList(
      //   paymentProviders,
      //   paymentId
      // );

      let airtimeBaxi = new BaxiIntegration();
      let airtimeProviders = await airtimeBaxi.airTimeProviders(
        paymentProviders,
        paymentId
      );
      return Promise.resolve(
        successMessage(
          airtimeProviders,
          "Airtime providers retrieved successfully"
        )
      );
    } catch (error) {
      Sentry.captureException(error);
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve airtime Providers")
      );
    }
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
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
