const { BadRequest, NotFound } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const { DataPurchase } = require("../../../interfaces/dataPurchase");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.Bundles = class Bundles {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { query } = params;
      const productId = query?.productId;
      if (!productId) {
        return Promise.reject(new BadRequest("Product Id  is missing"));
      }
      const sequelize = this.app.get("sequelizeClient");
      const { users, initiate_reset_pwd, product_list, providers } =
        sequelize.models;
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
      console.log(productDetails, "productDetails");
      const { provider: providerDetails, slug, productName } = productDetails;
      const { slug: provider } = providerDetails;

      let dataPurchase = new DataPurchase();
      let databundles = await dataPurchase.getBundleListList(provider);
      return Promise.resolve(
        successMessage(
          databundles,
          `Data bundles retrieved successfully ${provider}`
        )
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
