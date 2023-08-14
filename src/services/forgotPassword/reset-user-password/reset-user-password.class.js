/* eslint-disable no-unused-vars */
const { NotFound, BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
exports.ResetUserPassword = class ResetUserPassword {
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
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map((current) => this.create(current, params)));
    // }

    // return data;

    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd } = sequelize.models;
    const { email, code, password } = data;

    const userDetails = await users.findOne({
      where: { deletedAt: null, email: email },
    });

    if (userDetails === null) {
      let error = `User details not found in our database`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    let userId = userDetails?.id;
    const userResetDetails = await initiate_reset_pwd.findOne({
      where: { deletedAt: null, userId: userId, code, isUsed: false },
    });

    if (userResetDetails === null) {
      let error = `Incorrect reset code supplied, please check and try again`;

      const notFound = new BadRequest(error);
      return Promise.reject(notFound);
    }
    let passwordUpdateData = {
      password: password,
    };
    let UserResponse = await this.app
      .service("users")
      .patch(userId, passwordUpdateData);
    let resetId = userResetDetails?.id;
    await this.app.service("forgotPassword/initiate-reset-pwd").patch(resetId, {
      isUsed: true,
    });
    let response = successMessage(null, "Password reset successfully");
    return response;
  }
};
