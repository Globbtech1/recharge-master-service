/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const { TvSubscription } = require("../../../interfaces/tvSubscription");
const { getAllProvidersV2 } = require("../../../hooks/billPayment.hook");
const {
  successMessage,
  convertToKobo,
} = require("../../../dependency/UtilityFunctions");

exports.ProductTypeBundles = class ProductTypeBundles {
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
    const { productTypeName, productTypes } = data;
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { payment_providers } = sequelize.models;
      // const tvSubscription = new TvSubscription();
      // const tvProvidersBundle = await tvSubscription.getprovidersBundle(
      //   provider,productTypeName
      // );

      // const ProductType = productTypes.filter(
      //   (item) => item.code === productTypeName || item.name === productTypeName
      // );
      const ProductType = productTypes.find(
        (item) => item.code === productTypeName || item.name === productTypeName
      );

      ProductType.availablePricingOptions =
        ProductType?.availablePricingOptions.map((item) => {
          item.price = convertToKobo(item.price);
          item.priceIn = "Kobo";
          return item;
        });

      return Promise.resolve(
        successMessage(ProductType, "Provider bundles fetched successfully")
      );
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve bundles providers")
      );
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
