const { NotFound, BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  errorMessage,
} = require("../../../dependency/UtilityFunctions");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.ChangeUserProfilePix = class ChangeUserProfilePix {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async update(id, data, params) {
    const { user } = params;
    const { profileUrl } = data;
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
      let isValidUrl = verifyString(profileUrl);
      if (!isValidUrl) {
        const notFound = new BadRequest("Please enter a valid url");
        return Promise.reject(notFound);
      }
      userDetails.avatar = profileUrl;
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
const verifyString = (str) => {
  if (!str) return false;

  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};
