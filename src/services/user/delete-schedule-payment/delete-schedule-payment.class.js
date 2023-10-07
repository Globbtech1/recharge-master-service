const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.DeleteSchedulePayment = class DeleteSchedulePayment {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
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
    const sequelize = this.app.get("sequelizeClient");
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    let result = await this.app
      .service("schedulePayment/schedule-bills-payment")
      .remove(id);
    return Promise.resolve(
      successMessage(result, "Record deleted successfully")
    );
  }
};
