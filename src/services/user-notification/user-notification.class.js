const { Op, Sequelize } = require("sequelize");
const { successMessage } = require("../../dependency/UtilityFunctions");
/* eslint-disable no-unused-vars */
exports.UserNotification = class UserNotification {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    console.log(params?.query, "params?.query");
    const sequelize = this.app.get("sequelizeClient");
    const { notifications } = sequelize.models;
    let loggedInUser = params.user.id;

    var newQuery = {};
    for (var key in params.query) {
      if (key !== "$sort") {
        newQuery[key] = params.query[key];
      }
    }

    let userNotification = await notifications.findAll({
      where: {
        // order: [["createdAt", "DESC"]], // Sort by createdAt in descending order
        userId: loggedInUser,
        deletedAt: null,
        ...newQuery,
      },
      order: [[Sequelize.literal("createdAt"), "DESC"]],
      attributes: {
        exclude: ["deletedAt", "createdAt", "userId"],
      },
      // ...params?.query,
    });

    return Promise.resolve(
      successMessage(userNotification, "User notification")
    );
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    const sequelize = this.app.get("sequelizeClient");
    const { notifications } = sequelize.models;
    // Fetch the record by id from the Sequelize model
    const record = await notifications.findByPk(id);

    // If the record doesn't exist, return an error
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    // Perform the update on the fetched record
    const updatedRecord = await record.update(data);

    // Return the updated record
    return updatedRecord.get();
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
