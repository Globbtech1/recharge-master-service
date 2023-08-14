const { Op, Sequelize } = require("sequelize");
const {
  successMessage,
  getCurrentMonth,
  getCurrentYear,
} = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.Overview = class Overview {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const sequelize = this.app.get("sequelizeClient");
    const { transactions_history } = sequelize.models;

    const { user, query } = params;
    console.log(query, "parameter");
    const year = query?.year || getCurrentYear();
    const month = query?.month || getCurrentMonth();

    const loggedInUserId = user?.id;

    console.log(year, month, "po");

    // const year = "2023";
    // const month = "01";

    const debitSum = await transactions_history.sum("amount", {
      where: {
        paymentType: "debit",
        transactionStatus: "Successful",
        userId: loggedInUserId,
        transactionDate: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("year", Sequelize.col("transactionDate")),
              year
            ),
            Sequelize.where(
              Sequelize.fn("month", Sequelize.col("transactionDate")),
              month
            ),
          ],
        },
      },
    });

    const creditSum = await transactions_history.sum("amount", {
      where: {
        paymentType: "credit",
        transactionStatus: "Successful",
        userId: loggedInUserId,
        transactionDate: {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn("year", Sequelize.col("transactionDate")),
              year
            ),
            Sequelize.where(
              Sequelize.fn("month", Sequelize.col("transactionDate")),
              month
            ),
          ],
        },
      },
    });

    const totalExpenses = debitSum + creditSum;
    const averageExpenses = totalExpenses / 2;
    // return [];
    let result = {
      totalExpenses,
      Incoming: creditSum,
      Outgoing: debitSum,
      AvgExpenses: averageExpenses,
    };
    return Promise.resolve(successMessage(result, "User Expenses Overview"));
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
