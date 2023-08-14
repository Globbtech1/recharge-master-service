/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");
exports.MyBeneficiaries = class MyBeneficiaries {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const sequelize = this.app.get("sequelizeClient");
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    const paymentId = query?.paymentId || 0;
    if (paymentId === 0) {
      return Promise.reject(new BadRequest("Payment Id is required"));
    }

    let result = await this.app.service("user/quick-beneficiary").find({
      query: {
        userId: loggedInUserId,
        paymentListId: paymentId,
        $select: ["sourceImage", "uniqueNumber", "nameAlias", "metaData"],
      },
    });

    return Promise.resolve(
      successMessage(result, "   User saved Data Beneficiary")
    );
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
