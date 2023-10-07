const { NotFound, BadRequest } = require("@feathersjs/errors");
// const { CONSTANT } = require("../../dependency/Config");
const {
  hashData,
  compareHashData,
  errorMessage,
  successMessage,
  generateRandomNumber,
} = require("../../../dependency/UtilityFunctions");
const logger = require("../../../logger");
const { CONSTANT } = require("../../../dependency/Config");
/* eslint-disable no-unused-vars */
exports.InnitiateChangetransactionPin = class InnitiateChangetransactionPin {
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
    const {
      transactionPin,
      // confirmSecurityNumber,
      // oldSecurityNumber,
      // userPassword,
    } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (!transactionPin) {
      return Promise.reject(new BadRequest("Enter your transaction Pin"));
    }

    if (transactionPin.length !== CONSTANT.transactionPinSize) {
      return Promise.reject(
        new BadRequest(
          `Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
        )
      );
    }
    const { users, user_verifications } = sequelize.models;
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
      let hasSecurityNumberSet =
        userDetails.securityPin === null ? false : true;
      if (hasSecurityNumberSet === false) {
        return Promise.reject(new BadRequest("Transaction PIN not set"));
      }
      let transactionPinCorrect = await compareHashData(
        transactionPin,
        userDetails.securityPin
      );
      console.log(transactionPinCorrect, "transactionPinCorrect");
      if (!transactionPinCorrect) {
        return Promise.reject(new BadRequest(" Transaction PIN not incorrect"));
      }
      const { phoneNumber, email, fullName } = userDetails;
      const verification_reference = await generateRandomNumber(
        user_verifications,
        "token",
        6,
        false
      );
      if (phoneNumber) {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours

        await this.app.service("user-verifications").create({
          token: verification_reference,
          userId: loggedInUserId,
          expiredAt: expirationDate,
          type: CONSTANT.verificationType.changeTransactionPin, // 'type' field to distinguish email
          data: verification_reference,
        });
        let smsData = {
          phoneNumber: phoneNumber,
          message: `Your verification code is ${verification_reference}`,
        };
        this.app.service("integrations/sms-service").create(smsData);
      }
      if (email) {
        let EmailSendingData = {
          receiverEmail: email,
          subject: "Change Transaction pin",
          emailData: {
            customerName: fullName,
            customMessage: `To change your transaction pin please enter this  verification code ${verification_reference} `,
            mailTitle: "Change Transaction pin",
          },
          templateName: "default-email",
        };

        this.app.service("integrations/email-service").create(EmailSendingData);
      }
      // let resp = {
      //   verification_reference,
      //   data: null,
      // };
      // return resp;

      return Promise.resolve(
        successMessage(
          null,
          "A verification code has been sent to your email and phone  number."
        )
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while saving the Transaction PIN",
          error,
          500
        )
        // error
      );
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
