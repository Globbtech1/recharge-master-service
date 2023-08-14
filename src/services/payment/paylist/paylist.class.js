const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.Paylist = class Paylist {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }
  async find(params) {
    // let result = await this.app.service("payment-list").find({
    //   where: {
    //     deletedAt: null,
    //     paymentType: "debit",
    //   },
    // });
    const sequelize = this.app.get("sequelizeClient");

    const { payment_list } = sequelize.models;
    const result = await payment_list.findAll({
      where: {
        deletedAt: null,
        paymentType: "debit",
      },
      attributes: {
        exclude: [
          "deletedAt",
          "status",
          "password",
          "paymentType",
          "createdAt",
          "updatedAt",
          // "id",
        ],
      },
    });
    return Promise.resolve(
      successMessage(result, "All available payment list ")
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
