const { NotFound, BadRequest } = require("@feathersjs/errors");
const {
  compareHashData,
  errorMessage,
  successMessage,
  generateRandomNumber,
  maskSensitiveData,
} = require("../../../../dependency/UtilityFunctions");
const logger = require("../../../../logger");
const { CONSTANT } = require("../../../../dependency/Config");

/* eslint-disable no-unused-vars */
exports.InnitiateRequest = class InnitiateRequest {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async create(data, params) {
    const { user } = params;
    const { userPassword } = data;
    console.log(data, "data");
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");

    const { users, user_verifications } = sequelize.models;
    try {
      if (userPassword == null || userPassword == "") {
        const notFound = new NotFound("User password is required");
        return Promise.reject(notFound);
      }

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
        return Promise.reject(
          new BadRequest("user Password is incorrect \n please try again.")
        );
      }
      console.log(userDetails, "userDetails");
      const { phoneNumber, email, fullName } = userDetails;
      const verification_reference = await generateRandomNumber(
        user_verifications,
        "token",
        6,
        false
      );
      let sentPlatform = {};
      if (phoneNumber) {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours

        await this.app.service("user-verifications").create({
          token: verification_reference,
          userId: loggedInUserId,
          expiredAt: expirationDate,
          type: CONSTANT.verificationType.resetTransactionPin, // 'type' field to distinguish email
          data: verification_reference,
        });
        let smsData = {
          phoneNumber: phoneNumber,
          message: `Your verification code is ${verification_reference}`,
        };
        const maskedPhoneNumber = maskSensitiveData(phoneNumber, "phone");

        sentPlatform.maskedPhoneNumber = maskedPhoneNumber;
        this.app.service("integrations/sms-service").create(smsData);
      }
      if (email) {
        let EmailSendingData = {
          receiverEmail: email,
          subject: "Reset Transaction pin",
          emailData: {
            customerName: fullName,
            customMessage: `To reset your transaction pin please enter this  verification code ${verification_reference} `,
            mailTitle: "Reset Transaction pin",
          },
          templateName: "default-email",
        };
        const maskedEmail = maskSensitiveData(email, "email");

        sentPlatform.maskedEmail = maskedEmail;
        this.app.service("integrations/email-service").create(EmailSendingData);
      }
      return Promise.resolve(
        successMessage(
          sentPlatform,
          "A verification code has been sent to your email and phone  number."
        )
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while initiating the request",
          error,
          500
        )
        // error
      );
    }

    // return data;
  }
};
