const { Op } = require("sequelize");
const {
  successMessage,
  determineUserType,
} = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.AdminManagement = class AdminManagement {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { user, query } = params;
      const loggedInUserId = user?.id;
      const userType = query?.userType || "all";

      if (userType === "active") {
        let activeUsers = await this.getActiveUser(this.app);
        return Promise.resolve(
          successMessage(activeUsers, "Users on the platform")
        );
      }
      if (userType === "inActive") {
        let activeUsers = await this.getInActiveUser(this.app);
        return Promise.resolve(
          successMessage(activeUsers, "Users on the platform")
        );
      }
      let filters = { ...query };

      let userQuery = determineUserType(userType);
      filters = {
        ...filters,
        ...userQuery,
      };

      delete filters.userType;

      let allQueries = {
        $sort: {
          id: -1,
        },
        role: {
          [Op.not]: "customer",
        },
        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("users").find({
        query: allQueries,
      });

      return Promise.resolve(successMessage(result, "Users on the platform"));
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
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current, params)));
    // }

    console.log(data, "data");
    // return;
    let responseTransaction = await this.app.service("users").create(data);

    return responseTransaction;
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
