/* eslint-disable no-unused-vars */
const { successMessage } = require("../../../dependency/UtilityFunctions");

exports.DeleteUserFavouriteRecharge = class DeleteUserFavouriteRecharge {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
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
    const loggedInUserId = user?.id;
    let result = await this.app.service("user-favourite-recharge").remove(id);
    return Promise.resolve(
      successMessage(result, "Record deleted successfully")
    );
  }
};
