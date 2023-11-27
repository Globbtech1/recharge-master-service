const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");
/* eslint-disable no-unused-vars */
exports.GetFavouriteRecharges = class GetFavouriteRecharges {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }
  async find(params) {
    const sequelize = this.app.get("sequelizeClient");
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    let result = await this.app.service("user-favourite-recharge").find({
      query: {
        userId: loggedInUserId,
      },
    });

    return Promise.resolve(successMessage(result, "My Favorite Recharges"));
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
