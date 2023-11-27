/* eslint-disable no-unused-vars */
const logger = require("../../../logger");
const { TvSubscription } = require("../../../interfaces/tvSubscription");
const { getAllProvidersV2 } = require("../../../hooks/billPayment.hook");
const { successMessage } = require("../../../dependency/UtilityFunctions");
exports.Providers = class Providers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const { query, user } = params;
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { query } = params;
      const { payment_providers } = sequelize.models;
      const paymentId = query?.paymentId || 0;
      if (paymentId === 0) {
        return Promise.reject(new BadRequest("Payment Id is required"));
      }
      let paymentProviders = await getAllProvidersV2(payment_providers);
      let tvSubPurchase = new TvSubscription();
      let tvProviders = await tvSubPurchase.getProviders(
        paymentProviders,
        paymentId
      );
      return Promise.resolve(
        successMessage(tvProviders, "tv providers retrieved successfully")
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve tv subscription providers")
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
