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
    // const { initiate_reset_pwd, users } = sequelize.models;

    const userDetails = await users.findOne({
      where: payload,
    });
    if (userDetails === null) {
      let error = `User details not found in our database`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    const verification_reference = await generateRandomNumber(
      user_verifications,
      "token",
      6,
      false
    );
    const { email, fullName, id: loggedInUserId, phoneNumber } = userDetails;
    return Promise.resolve(
      successMessage(userDetails, "User Account Deleted successfully")
    );
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours
    await this.app.service("user-verifications").create({
      token: verification_reference,
      userId: loggedInUserId,
      expiredAt: expirationDate,
      type: CONSTANT.verificationType.deleteAccount, // 'type' field to distinguish email
      data: verification_reference,
    });

    if (phoneNumber) {
      let smsData = {
        phoneNumber: phoneNumber,
        // phoneNumber: "07065873900",
        message: `Your rechargedMaster authentication code for account deletion is ${verification_reference}`,
      };
      this.app.service("integrations/sms-service").create(smsData);
    }
    if (email) {
      // Define the email data
      const emailData = {
        receiverEmail: email,
        subject: "RechargedMaster Account Deletion",
        emailData: {
          customerName: fullName, // Replace with the user's name if available
          customMessage: `we have receive a request to delete your account use this code  ${verification_reference} to verify \n Keep in mind that if you proceed with account deletion, all your data will be permanently removed, and any remaining funds in your wallet cannot be recovered`,
          mailTitle: "Sad to see you go",
        },
        templateName: "default-email", // Specify the email template
      };

      // Send the verification email using the email service
      // try {
      await this.app.service("integrations/email-service").create(emailData);
    }
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
