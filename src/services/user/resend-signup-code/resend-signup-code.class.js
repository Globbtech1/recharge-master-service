const { NotFound } = require("@feathersjs/errors");
const { Sequelize } = require("sequelize");
const { CONSTANT } = require("../../../dependency/Config");
const {
  generateRandomNumber,
} = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.ResendSignupCode = class ResendSignupCode {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find() {
    return [];
  }

  async get(id) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data) {
    const { emailOrPhoneNumber } = data;

    const sequelize = this.app.get("sequelizeClient");
    const { users, user_verifications } = sequelize.models;

    if (!emailOrPhoneNumber) {
      let error = `Email or phone number is required`;

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

    const now = new Date();
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours
    await this.app.service("user-verifications").create({
      token: verification_reference,
      userId: loggedInUserId,
      expiredAt: expirationDate,
      type: CONSTANT.verificationType.onWelcome, // 'type' field to distinguish email
      data: verification_reference,
    });

    if (phoneNumber) {
      let smsData = {
        phoneNumber: phoneNumber,
        message: `Welcome, Your verification code is ${verification_reference}`,
      };
      this.app.service("integrations/sms-service").create(smsData);
    }
    if (email) {
      // Define the email data
      const emailData = {
        receiverEmail: email,
        subject: "Welcome to Recharge Master",
        emailData: {
          customerName: fullName, // Replace with the user's name if available
          customMessage: `We welcome you to recharge master . A platform where you can do all your bills payment. \n please use this code to verify your account ${verification_reference}`,
          mailTitle: "Welcome to our Platform",
        },
        templateName: "default-email", // Specify the email template
      };

      // Send the verification email using the email service
      // try {
      await this.app.service("integrations/email-service").create(emailData);
    }
  }

  async update(data) {
    return data;
  }

  async patch(data) {
    return data;
  }

  async remove(id) {
    return { id };
  }
};
