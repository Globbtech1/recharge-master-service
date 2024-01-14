/* eslint-disable no-unused-vars */
const { NotFound, BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../../dependency/Config");
const {
  hashData,
  compareHashData,
  errorMessage,
  successMessage,
} = require("../../../../dependency/UtilityFunctions");
const logger = require("../../../../logger");
exports.FinalizeRequest = class FinalizeRequest {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async update(id, data, params) {
    const { user } = params;
    const { transactionPin, confirmTransactionPin, token, platform } = data;
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");

    if (transactionPin.length !== CONSTANT.transactionPinSize) {
      return Promise.reject(
        new BadRequest(
          `Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
        )
      );
    }
    if (confirmTransactionPin.length !== CONSTANT.transactionPinSize) {
      return Promise.reject(
        new BadRequest(
          `Confirm Transaction PIN must be ${CONSTANT.transactionPinSize} digits `
        )
      );
    }
    if (transactionPin !== confirmTransactionPin) {
      return Promise.reject(new BadRequest(`Transaction PIN does not match `));
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

      if (!token) {
        return Promise.reject(new BadRequest("Otp Data missing"));
      }

      if (!platform) {
        return Promise.reject(new BadRequest("Verification type Missing"));
      }

      const verificationDetails = await user_verifications.findOne({
        where: {
          deletedAt: null,
          token: token,
          isUsed: true,
          type: platform,
          userId: loggedInUserId,
        },
      });
      if (verificationDetails === null) {
        return Promise.reject(new BadRequest("Verification data not valid"));
      }

      let hashedValue = await hashData(transactionPin);
      console.log(hashedValue, "hashedValue");
      userDetails.securityPin = hashedValue;
      await userDetails.save();
      return Promise.resolve(
        successMessage(null, "Transaction PIN changed successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while saving the Transaction PIN",
          error,
          500
        )
      );
    }
  }
};
