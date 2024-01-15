/* eslint-disable no-unused-vars */
const { CONSTANT } = require("../../../dependency/Config");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const { getTotalWalletFunding } = require("../../../hooks/adminServices.hook");
exports.FundingHistory = class FundingHistory {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { query } = params;
      const sequelize = this.app.get("sequelizeClient");
      const startDate = query?.startDate;
      const endDate = query?.endDate;
      const paymentId = query?.paymentId;
      const fundingSource = query?.fundingSource;
      const transactionStatus = query?.transactionStatus;
      const { account_funding } = sequelize.models;

      let filters = { ...query };
      if (startDate && endDate) {
        delete filters.startDate;
        delete filters.endDate;
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
      delete filters.startDate;
      delete filters.endDate;

      let allQueries = {
        $sort: {
          id: -1,
        },
        transactionType: CONSTANT.transactionType.AccountFunding,

        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("transactions-history").find({
        query: allQueries,
      });
      const TotalFunding = await getTotalWalletFunding(account_funding);

      let resp = {
        TotalFunding,
        result,
      };

      return Promise.resolve(successMessage(resp, "Funding History"));
    } catch (error) {
      console.log(error);
    }
  }

  async get(id) {
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

  async update(data) {
    return data;
  }

  async patch(data) {
    return data;
  }

  async remove(id) {
    return { id };
  }
};
