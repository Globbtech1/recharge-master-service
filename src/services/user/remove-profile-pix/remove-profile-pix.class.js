const { NotFound } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  errorMessage,
} = require("../../../dependency/UtilityFunctions");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.RemoveProfilePix = class RemoveProfilePix {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }
  async update(id, data, params) {
    const { user } = params;
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
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

      let defaultImage = CONSTANT.defaultProfileImage;
      userDetails.avatar = defaultImage;
      await userDetails.save();
      return Promise.resolve(
        successMessage(null, "User profile updated successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while removing your profile",
          error,
          500
        )
      );
    }
  }
};
