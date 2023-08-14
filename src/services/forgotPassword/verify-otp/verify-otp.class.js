const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.VerifyOtp = class VerifyOtp {
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
    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd } = sequelize.models;
    const { email, code } = data;

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

    let response = successMessage(null, "Otp verified");
    return response;
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
