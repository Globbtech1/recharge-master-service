const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.Providers = class Providers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const sequelize = this.app.get("sequelizeClient");
    const { user, query } = params;
    let result = await this.app.service("providers").find({
      query: {
        deletedAt: null,
        $select: ["id", "productName", "slug", "image", "createdAt"],
      },
    });

    return Promise.resolve(successMessage(result, "Available providers"));
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
