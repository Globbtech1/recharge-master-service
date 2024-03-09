/* eslint-disable no-unused-vars */
const { NotFound } = require("@feathersjs/errors");
const { Sequelize } = require("sequelize");
const { CONSTANT } = require("../../../dependency/Config");
const {
  generateRandomNumber,
  successMessage,
} = require("../../../dependency/UtilityFunctions");

exports.DeleteAccountRequestFinalize = class DeleteAccountRequestFinalize {
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

  async create(data) {
    const { emailOrPhoneNumber, otpCode } = data;

    const sequelize = this.app.get("sequelizeClient");
    const { users, user_verifications } = sequelize.models;

    if (!emailOrPhoneNumber) {
      let error = `Email or phone number is required`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    if (!otpCode) {
      let error = `otp code  is required`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    let payload = {
      deletedAt: null,
      [Sequelize.Op.or]: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    };
    const userDetails = await users.findOne({
      where: payload,
    });
    if (userDetails === null) {
      let error = `User details not found in our database`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }

    const { email, fullName, id: loggedInUserId, phoneNumber } = userDetails;
    const verificationDetails = await user_verifications.findOne({
      where: {
        deletedAt: null,
        token: otpCode,
        isUsed: false,
        type: CONSTANT.verificationType.deleteAccount,
        userId: loggedInUserId,
      },
    });
    if (verificationDetails === null) {
      return Promise.reject(
        new BadRequest(
          "Account Validation can not be completed.\n Please check the otp and try again"
        )
      );
    }

    await this.app.service("users").remove(loggedInUserId);

    return Promise.resolve(
      successMessage(userDetails, "User Account Deleted successfully")
    );
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
