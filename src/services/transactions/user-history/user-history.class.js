/* eslint-disable no-unused-vars */
// exports.UserHistory = class UserHistory {
const { successMessage } = require("../../../dependency/UtilityFunctions");
const Sentry = require("@sentry/node");

/* eslint-disable no-unused-vars */
exports.UserHistory = class UserHistory {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { user, query } = params;
      console.log(query, "parameter");
      const loggedInUserId = user?.id;
      const startDate = query?.startDate;
      const endDate = query?.endDate;
      const paymentId = query?.paymentId;
      const fundingSource = query?.fundingSource;
      const transactionStatus = query?.transactionStatus;
      let filters = {};
      if (startDate && endDate) {
        filters = {
          ...filters,
          ...{
            transactionDate: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        };
      }
      if (paymentId) {
        filters = {
          ...filters,
          ...{
            productId: paymentId,
          },
        };
      }
      if (fundingSource) {
        filters = {
          ...filters,
          ...{
            paidBy: fundingSource,
          },
        };
      }
      if (transactionStatus) {
        filters = {
          ...filters,
          ...{
            transactionStatus: transactionStatus,
          },
        };
      }
      // let filters = {};

      let allQueries = {
        $sort: {
          transactionDate: -1,
        },
        userId: loggedInUserId,
        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("transactions-history").find({
        query: allQueries,
      });

      const sequelize = this.app.get("sequelizeClient");

      return Promise.resolve(successMessage(result, "User History"));
    } catch (error) {
      console.log(error);
      // Sentry.captureException(error);
    }
  }

  // async get(id, params) {
  //   return {
  //     id,
  //     text: `A new message with ID: ${id}!`,
  //   };
  // }

  // async create(data, params) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.create(current, params)));
  //   }

  //   return data;
  // }

  // async update(id, data, params) {
  //   return data;
  // }

  // async patch(id, data, params) {
  //   return data;
  // }

  // async remove(id, params) {
  //   return { id };
  // }
};
