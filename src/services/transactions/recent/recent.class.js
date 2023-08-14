const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.Recent = class Recent {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    // const paymentType = query?.payType || 0;

    // const paymentId = query?.paymentId || 0;
    // if (paymentId === 0) {
    //   return Promise.reject(new BadRequest("Payment Id is required"));
    // }

    // TransactionHistory.findAndCountAll({
    //   order: [["transactionDate", "DESC"]],
    //   offset: 10,
    //   limit: 10,
    // }).then(({ count, rows }) => {
    //   console.log(count);
    //   console.log(rows);
    // });

    // let result = await this.app.service("transactions-history").find({
    //   query: {
    //     offset: 10,
    //     limit: 10,
    //   },
    //   order: [["transactionDate", "DESC"]],
    // });
    let result = await this.app.service("transactions-history").find({
      query: {
        // $skip: 10,
        $limit: 10,
        // order: [["transactionDate", "DESC"]],
        $sort: {
          id: -1,
        },
        userId: loggedInUserId,
        transactionStatus: "Successful",
      },
    });

    const sequelize = this.app.get("sequelizeClient");

    return Promise.resolve(successMessage(result, "User Recent History"));
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
