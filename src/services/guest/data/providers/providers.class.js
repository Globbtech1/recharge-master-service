/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../../dependency/UtilityFunctions");
const { DataPurchase } = require("../../../../interfaces/dataPurchase");
const logger = require("../../../../logger");
exports.Providers = class Providers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { query } = params;

      const { payment_providers } = sequelize.models;
      const paymentId = query?.paymentId || 0;
      if (paymentId === 0) {
        return Promise.reject(new BadRequest("Payment Id is required"));
      }
      const paymentProvidersList = await payment_providers.findAll({
        where: {
          deletedAt: null,
        },
      });
      let paymentProviders = paymentProvidersList || [];
      paymentProviders = JSON.stringify(paymentProviders);
      paymentProviders = JSON.parse(paymentProviders);

      let dataPurchase = new DataPurchase();
      let dataProviders = await dataPurchase.getProviderList(
        paymentProviders,
        paymentId
      );

      return Promise.resolve(
        successMessage({ dataProviders }, "Data providers retrieved successfully")
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve data Providers")
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
