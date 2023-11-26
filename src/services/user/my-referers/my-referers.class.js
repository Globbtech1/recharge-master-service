const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.MyReferers = class MyReferers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { query } = params;

      const { users } = sequelize.models;
      const myReferrers = await users.findAll({
        where: {
          deletedAt: null,
          invitedBy: "7B8djCgB6aywj4j",
        },
      });

      return Promise.resolve(successMessage(myReferrers, "My referrers"));
    } catch (error) {
      return Promise.reject(
        new BadRequest("unable to retrieve data Providers")
      );
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
