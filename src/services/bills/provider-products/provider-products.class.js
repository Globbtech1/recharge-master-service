const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.ProviderProducts = class ProviderProducts {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }
  async find(params) {
    try {
      const { query } = params;
      const providerId = query?.providerId;

      let filters = {
        $select: [
          "id",
          "providerId",
          "productName",
          "slug",
          "image",
          "createdAt",
        ],
      };

      if (providerId) {
        filters = {
          ...filters,
          ...{
            providerId: providerId,
          },
        };
      }

      let allQueries = {
        $sort: {
          productName: -1,
        },
        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("product-list").find({
        query: allQueries,
      });

      const sequelize = this.app.get("sequelizeClient");

      return Promise.resolve(successMessage(result, "Available products"));
    } catch (error) {
      console.log(error, "error");
      return Promise.reject(new BadRequest(error));
    }
  }
};
