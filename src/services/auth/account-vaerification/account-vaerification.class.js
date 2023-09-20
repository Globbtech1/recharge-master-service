const { BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const { CONSTANT } = require("../../../dependency/Config");

/* eslint-disable no-unused-vars */
exports.AccountVaerification = class AccountVaerification {
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
    // const { user } = params;
    const { token, platform } = data;
    logger.info("token...", { token });

    // const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { users, user_verifications } = sequelize.models;
    try {
      const verificationDetails = await user_verifications.findOne({
        where: {
          deletedAt: null,
          token: token,
          isUsed: false,
          type: platform,
        },
      });
      if (verificationDetails === null) {
        return Promise.reject(new BadRequest("Verification data not valid"));
      }
      let userId = verificationDetails?.userId;

      const userDetails = await users.findOne({
        where: {
          deletedAt: null,
          id: userId,
        },
      });
      if (userDetails === null) {
        return Promise.reject(
          new BadRequest("This user does not exist on the platform")
        );
      }
      let userUpdatedData = verificationDetails?.data;
      verificationDetails.isUsed = true;
      await verificationDetails.save();
      if (platform === CONSTANT.verificationType.email) {
        userDetails.isEmailVerify = true;
        userDetails.email = userUpdatedData;
      }
      if (platform === CONSTANT.verificationType.phoneNumber) {
        userDetails.isPhoneNumberVerify = true;
        userDetails.phoneNumber = userUpdatedData;
      }

      await userDetails.save();

      return;
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("An error has occurred while Verifying user account")
      );
    }

    // return data;
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
