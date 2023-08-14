/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const logger = require("../../../../logger");
const { TvSubscription } = require("../../../../interfaces/tvSubscription");
const { getAllProvidersV2 } = require("../../../../hooks/billPayment.hook");
const { successMessage } = require("../../../../dependency/UtilityFunctions");

exports.ProviderProductTypes = class ProviderProductTypes {
  constructor (options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    const { provider } = data;
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { payment_providers } = sequelize.models;
      const tvSubscription = new TvSubscription();
      const tvProvidersBundle = await tvSubscription.getprovidersBundle(
        provider
      );

      return Promise.resolve(
        successMessage(tvProvidersBundle, "Provider bundles fetched successfully")
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve bundles providers")
      );
    }
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
