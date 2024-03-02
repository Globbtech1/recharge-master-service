/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const logger = require("../../../logger");
const crypto = require("crypto"); // Import the crypto module
const {
  generateRandomNumber,
} = require("../../../dependency/UtilityFunctions");
exports.VerifyUserPhoneNumber = class VerifyUserPhoneNumber {
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
    const { user } = params;
    const { phoneNumber } = data;

    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { users, user_verifications } = sequelize.models;
    if (!phoneNumber || phoneNumber === "") {
      return Promise.reject(new BadRequest("Phone number is required"));
    }
    try {
      const userDetails = await users.findOne({
        where: {
          deletedAt: null,
          email: phoneNumber,
        },
      });
      if (userDetails !== null) {
        let userId = userDetails?.id;
        if (userId !== loggedInUserId) {
          return Promise.reject(
            new BadRequest("This Phone Number is associated with another user")
          );
        }
      }
      const loggedInUserDetails = await users.findOne({
        where: {
          deletedAt: null,
          id: loggedInUserId,
        },
      });
      if (loggedInUserDetails === null) {
        return Promise.reject(
          new BadRequest("This user does not exist on the platform")
        );
      }

      const verification_reference = await generateRandomNumber(
        user_verifications,
        "token",
        6,
        false
      );
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours

      await this.app.service("user-verifications").create({
        token: verification_reference,
        userId: loggedInUserId,
        expiredAt: expirationDate,
        type: CONSTANT.verificationType.phoneNumber, // 'type' field to distinguish email
        data: phoneNumber,
      });
      let smsData = {
        phoneNumber: phoneNumber,
        message: `Your rechargedMaster authentication code is ${verification_reference}`,
      };
      this.app.service("integrations/sms-service").create(smsData);
      let resp = {
        verification_reference,
        data: phoneNumber,
      };
      return resp;
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("An error has occurred while sending verification code")
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
