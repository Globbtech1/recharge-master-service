/* eslint-disable no-unused-vars */
const { Op, Sequelize } = require("sequelize");
const { successMessage } = require("../../../dependency/UtilityFunctions");
exports.PromoBeneficiary = class PromoBeneficiary {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { user, query } = params;
      const promoId = query?.promoId || "0";

      // if (userType === "active") {
      //   let activeUsers = await this.getActiveUser(this.app);
      //   return Promise.resolve(
      //     successMessage(activeUsers, "Users on the platform")
      //   );
      // }
      // if (userType === "inActive") {
      //   let activeUsers = await this.getInActiveUser(this.app);
      //   return Promise.resolve(
      //     successMessage(activeUsers, "Users on the platform")
      //   );
      // }
      let filters = { ...query };

      // let userQuery = this.determineUserType(userType);
      filters = {
        ...filters,
        couponManagementId: promoId,
        // ...userQuery,
      };

      delete filters.promoId;

      let allQueries = {
        $sort: {
          id: -1,
        },
        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("used-coupon").find({
        query: allQueries,
      });

      return Promise.resolve(successMessage(result, "Promo Beneficiary List"));
    } catch (error) {
      console.log(error);
      // Sentry.captureException(error);
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
