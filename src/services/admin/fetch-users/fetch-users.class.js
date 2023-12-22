const { Op, Sequelize } = require("sequelize");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.FetchUsers = class FetchUsers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const { user, query } = params;
      console.log(query, "parameter");
      const loggedInUserId = user?.id;
      const userType = query?.userType || "all";
      console.log(userType, "userType");
      // const endDate = query?.endDate;
      // const paymentId = query?.paymentId;
      // const fundingSource = query?.fundingSource;
      // const transactionStatus = query?.transactionStatus;

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

      let userQuery = this.determineUserType(userType);
      filters = {
        ...filters,
        ...userQuery,
      };

      delete filters.userType;

      let allQueries = {
        $sort: {
          id: -1,
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
  determineUserType(userType) {
    switch (userType) {
      case "verified":
        return { isPhoneNumberVerify: true };
      case "nonVerified":
        return { isPhoneNumberVerify: false };
      case "all":
        return {};
      default:
        return { userType: "Teacher" };
    }
  }
  async getActiveUser(app) {
    const sequelize = app.get("sequelizeClient");

    const { transactions_history, users } = sequelize.models;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const activeUsersddd = await app.service("users").find({
      query: {
        $sort: {
          id: -1,
        },
      },
      // include: [
      //   {
      //     // model: app.service("transactions_history").Model,
      //     model: transactions_history,
      //     where: {
      //       userId: Sequelize.literal(
      //         "`users`.`id` = `transactions_history`.`userId`"
      //       ),
      //       transactionDate: {
      //         [Op.gte]: lastMonth,
      //       },
      //     },
      //   },
      // ],
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

    const activeUserCount = await users.findAll({
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
      // ...paginate,
    });

    return activeUserCount;
  }
  async getInActiveUser(app) {
    const sequelize = app.get("sequelizeClient");

    const { transactions_history } = sequelize.models;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const inactiveUsers = await app.service("users").find({
      include: [
        {
          model: transactions_history,
          where: {
            userId: Sequelize.literal(
              "`users`.`id` = `transactions_history`.`userId`"
            ),
            [Op.or]: [
              { transactionDate: null }, // Users with no transactions
              {
                transactionDate: {
                  [Op.lt]: Sequelize.literal("`users`.`createdAt`"),
                },
              }, // Users with last transaction before onboarding
            ],
          },
          required: false, // Use required: false to perform a LEFT JOIN
        },
      ],
      where: {
        "$transactions_history.id$": { [Op.eq]: null }, // Filter users with no transactions
      },
    });

    return inactiveUsers;
  }
};
