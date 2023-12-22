const {
  successMessage,
  convertToNaira,
} = require("../../../dependency/UtilityFunctions");
const { Op, Sequelize } = require("sequelize");

/* eslint-disable no-unused-vars */
exports.DashboardData = class DashboardData {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { user, query } = params;
      console.log(query, "parameter");
      const loggedInUserId = user?.id;

      const sequelize = this.app.get("sequelizeClient");

      const { transactions_history, users, account_funding, account_balance } =
        sequelize.models;
      // 1. Total TNX
      const totalTNXCount = await transactions_history.count();

      // 2. Total TNX Count
      const totalTNX = await transactions_history.sum("amountPaid");

      // 3. Total Active user Count
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // const activeUserCount = await users.count({
      //   include: [
      //     {
      //       model: transactions_history,
      //       where: {
      //         userId: Sequelize.literal(
      //           "`users`.`id` = `transactions_history`.`userId`"
      //         ),
      //         transactionDate: {
      //           [Op.gte]: lastMonth,
      //         },
      //       },
      //     },
      //     {
      //       model: account_balance,
      //       where: {
      //         userId: Sequelize.literal(
      //           "`users`.`id` = `account_balance`.`userId`"
      //         ),
      //         balance: {
      //           [Op.gt]: 0,
      //         },
      //       },
      //     },
      //   ],
      // });
      const activeUserCount = await users.count({
        distinct: true, // Add this line to count distinct users

        include: [
          {
            model: transactions_history,
            as: "transactionsHistory", // Add this line to specify the alias
            where: {
              userId: Sequelize.literal(
                "`users`.`id` = `transactionsHistory`.`userId`"
              ),
              transactionDate: {
                [Op.gte]: lastMonth,
              },
            },
          },
        ],
      });

      // 4. Total Wallet Funding
      const totalWalletFunding = await account_funding.sum("amount");

      // 5. Total Pending TNX
      const totalPendingTNX = await transactions_history.count({
        where: {
          transactionStatus: "Pending",
        },
      });

      // 6. Total Failed TNX
      const totalFailedTNX = await transactions_history.count({
        where: {
          transactionStatus: "Failed",
        },
      });

      // 7. Total Successful TNX
      const totalSuccessfulTNX = await transactions_history.count({
        where: {
          transactionStatus: "Successful",
        },
      });

      // 8. Total Wallet Value
      const totalWalletValue = await account_balance.sum("balance");

      // 9. (Add additional metrics as needed)

      // Now you have the values for each metric, and you can use them as needed in your dashboard.
      // let chunRate = await this.calculateUserChunRate(this.app);

      let result = {
        totalTNX,
        totalTNXCount,
        activeUserCount: activeUserCount,
        totalWalletFunding,
        totalPendingTNX,
        totalFailedTNX,
        totalSuccessfulTNX,
        totalWalletValue: convertToNaira(totalWalletValue),
        chunRate: 80,
      };
      console.log(result);
      return Promise.resolve(successMessage(result, "Dashboard Data"));
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
  async calculateUserChunRate(app) {
    const { Op } = require("sequelize");

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const sequelize = app.get("sequelizeClient");

    const { users } = sequelize.models;
    // const churnedUsers = await users.findAll({
    //   where: {
    //     [Op.and]: [
    //       {
    //         id: {
    //           [Op.notIn]: Sequelize.literal(`
    //         SELECT DISTINCT "users"."id"
    //         FROM "users"
    //         LEFT JOIN "transactions_history" ON "users"."id" = "transactions_history"."userId"
    //         WHERE "transactions_history"."transactionDate" >= '${lastMonth.toISOString()}'
    //       `),
    //         },
    //       },
    //       // Add any other conditions if needed
    //     ],
    //   },
    // });
    const churnedUsers = await users.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.notIn]: Sequelize.literal(
                "SELECT DISTINCT userId FROM transactions_history WHERE transactionDate >= 2023-11-21T23:56:41.300Z"
              ),
            },
          },
          // Add any other conditions if needed
        ],
      },
    });

    // Calculate churn rate
    const totalUsersAtBeginningOfPeriod = await users.count();
    const churnRate =
      (churnedUsers.length / totalUsersAtBeginningOfPeriod) * 100;
    return churnRate;
  }
};
