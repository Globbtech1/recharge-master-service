/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../../dependency/UtilityFunctions");
const { DataPurchase } = require("../../../../interfaces/dataPurchase");
const logger = require("../../../../logger");

exports.Bundles = class Bundles {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { query } = params;
      const dataProvider = query?.provider;
      if (!dataProvider) {
        return Promise.reject(new BadRequest("Provider is missing"));
      }

      let dataPurchase = new DataPurchase();
      let databundles = await dataPurchase.getBundleListList(dataProvider);
      return Promise.resolve(
        successMessage(databundles, "Data bundles retrieved successfully")
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(new BadRequest("Unable to retrieve data bundles"));
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
