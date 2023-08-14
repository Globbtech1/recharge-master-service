const { BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const {
  ElectricityPurchase,
} = require("../../../interfaces/electricityPurchase");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const { getAllProvidersV2 } = require("../../../hooks/billPayment.hook");

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
      const { payment_providers } = sequelize.models;
      const paymentId = query?.paymentId || 0;
      if (paymentId === 0) {
        return Promise.reject(new BadRequest("Payment Id is required"));
      }
      let paymentProviders = await getAllProvidersV2(payment_providers);
      let electricityPurchase = new ElectricityPurchase();
      let electricityProviders = await electricityPurchase.getProviders(
        paymentProviders,
        paymentId
      );
      // return { electricityProviders };
      // console.log(electricityProviders);

      return Promise.resolve(
        successMessage(
          electricityProviders,
          "Electricity providers fetched successfully"
        )
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("Unable to retrieve electricity providers")
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
