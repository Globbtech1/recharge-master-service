const { BadRequest, NotFound } = require("@feathersjs/errors");
const logger = require("../../../logger");
const {
  errorMessage,
  successMessage,
  compareHashData,
} = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.VerifyUserPassword = class VerifyUserPassword {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async create(data, params) {
    const { user } = params;
    const { userPassword } = data;
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (!userPassword) {
      return Promise.reject(new BadRequest("Enter your password"));
    }

    const { users } = sequelize.models;
    try {
      const userDetails = await users.findOne({
        where: {
          deletedAt: null,
          id: loggedInUserId,
        },
      });
      if (userDetails === null) {
        const notFound = new NotFound("User not found, please try again");
        return Promise.reject(notFound);
      }

      let passwordCorrect = await compareHashData(
        userPassword,
        userDetails.password
      );
      if (!passwordCorrect) {
        return Promise.reject(new BadRequest("Your Password is incorrect"));
      }

      return Promise.resolve(
        successMessage(null, "Password Verified successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage("Something went wrong, please try again later", error, 500)
      );
    }
  }
};
