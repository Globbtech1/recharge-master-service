const { BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const logger = require("../../../logger");
const crypto = require("crypto"); // Import the crypto module

/* eslint-disable no-unused-vars */
exports.VerifyUserEmail = class VerifyUserEmail {
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
    const { email: emailAddress } = data;
    logger.info("data", user);
    logger.info("email...", { emailAddress });

    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { users } = sequelize.models;
    try {
      const userDetails = await users.findOne({
        where: {
          deletedAt: null,
          email: emailAddress,
        },
      });
      if (userDetails !== null) {
        let userId = userDetails?.id;
        if (userId !== loggedInUserId) {
          return Promise.reject(
            new BadRequest("This email is associated with another user")
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

      const token = crypto.randomBytes(20).toString("hex");
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours

      await this.app.service("user-verifications").create({
        token,
        userId: loggedInUserId,
        expiredAt: expirationDate,
        type: CONSTANT.verificationType.email, // 'type' field to distinguish email
        data: emailAddress,
      });

      let resp = {
        token,
        email: emailAddress,
      };
      const verificationLink = `${process.env.WEBSITE_HOSTING}/email-verification?token=${token}`;
      let EmailSendingData = {
        receiverEmail: emailAddress,
        subject: "Account Verification",
        emailData: {
          customerName: "",
          customMessage: `To verify your email, please enter click on this link ${verificationLink} or copy it to your browser`,
          mailTitle: "Please verify your account",
        },
        templateName: "default-email",
      };

      this.app.service("integrations/email-service").create(EmailSendingData);
      return resp;
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("An error has occurred while sending verification email")
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
