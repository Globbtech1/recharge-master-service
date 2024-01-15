/* eslint-disable no-unused-vars */
const { CONSTANT } = require("../../../dependency/Config");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const {
  getTotalWalletFunding,
  getTotalWalletValue,
} = require("../../../hooks/adminServices.hook");
exports.WalletTransferHistory = class WalletTransferHistory {
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
      const { account_funding, account_balance } = sequelize.models;

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
        transactionType: CONSTANT.transactionType.walletTransfer,

        ...filters,
      };
      console.log(allQueries, "allQueries");
      let result = await this.app.service("transactions-history").find({
        query: allQueries,
      });
      const totalWalletBalance = await getTotalWalletValue(account_balance);

      let resp = {
        totalWalletBalance,
        result,
      };

      return Promise.resolve(successMessage(resp, "Wallet Transfer History"));
    } catch (error) {
      console.log(error);
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
