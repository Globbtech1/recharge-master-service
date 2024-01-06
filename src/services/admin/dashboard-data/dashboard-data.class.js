const {
  successMessage,
  convertToNaira,
} = require("../../../dependency/UtilityFunctions");
const { Op, Sequelize } = require("sequelize");
const {
  getTotalWalletValue,
  getTotalTNXCount,
  getTotalTNXAmount,
  getActiveUserCount,
  getTotalWalletFunding,
  getTotalPendingTNX,
  getTotalFailedTNX,
  getTotalSuccessfulTNX,
  calculatePaymentModePercentages,
  getDailySignUpCount,
  getSalesPerProduct,
} = require("../../../hooks/adminServices.hook");

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
      // const totalTNXCount = await transactions_history.count();
      const totalTNXCount = await getTotalTNXCount(transactions_history);

      // 2. Total TNX Count
      const totalTNX = await getTotalTNXAmount(transactions_history);

      // 3. Total Active user Count
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const activeUserCount = await getActiveUserCount(
        users,
        transactions_history,
        account_balance
      );

      // 4. Total Wallet Funding

      const totalWalletFunding = await getTotalWalletFunding(account_funding);

      // 5. Total Pending TNX
      const totalPendingTNX = await getTotalPendingTNX(transactions_history);

      // 6. Total Failed TNX
      const totalFailedTNX = await getTotalFailedTNX(transactions_history);

      // 7. Total Successful TNX
      const totalSuccessfulTNX = await getTotalSuccessfulTNX(
        transactions_history
      );
      // 8. Total Wallet Value
      const totalWalletValue = await getTotalWalletValue(account_balance);
      const PlatformModePercentages = await calculatePaymentModePercentages(
        transactions_history,
        "platform"
      );
      const PaymentModePercentages = await calculatePaymentModePercentages(
        transactions_history,
        "paymentMethod"
      );

      const dailySignUpCount = await getDailySignUpCount({
        users,
        //   startDate: "2023-09-01",
        //   endDate: "2023-12-07",
      });

      const salesPerProduct = await getSalesPerProduct({
        transactions_history,
        // startDate: "2023-08-01",
        // endDate: "2023-11-07",
      });

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
        PaymentModePercentages,
        PlatformModePercentages,
        dailySignUpCount,
        salesPerProduct,
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
