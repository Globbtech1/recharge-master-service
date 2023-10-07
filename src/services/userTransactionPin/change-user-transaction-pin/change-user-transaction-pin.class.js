/* eslint-disable no-unused-vars */
const { NotFound, BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  hashData,
  compareHashData,
  errorMessage,
  successMessage,
} = require("../../../dependency/UtilityFunctions");
const logger = require("../../../logger");

exports.ChangeUserTransactionPin = class ChangeUserTransactionPin {
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

  async update(id, data, params) {
    const { user } = params;
    const {
      oldTransactionPin,
      transactionPin,
      confirmTransactionPin,
      // userPassword,
    } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    // if (oldSecurityNumber === securityNumber) {
    //   throw new BadRequest(
    //     "New Transaction PIN cannot be same as old Transaction PIN"
    //   );
    // }

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
      let hasSecurityNumberSet =
        userDetails.securityPin === null ? false : true;
      if (hasSecurityNumberSet === false) {
        return Promise.reject(new BadRequest("Transaction PIN not set"));
      }
      let oldTransactionPinCorrect = await compareHashData(
        oldTransactionPin,
        userDetails.securityPin
      );
      console.log(oldTransactionPinCorrect, "oldSecurityNumberCorrect");
      if (!oldTransactionPinCorrect) {
        return Promise.reject(
          new BadRequest("Old Transaction PIN is incorrect")
        );
      }
      // let passwordCorrect = await compareHashData(
      //   userPassword,
      //   userDetails.password
      // );
      // if (!passwordCorrect) {
      //   return Promise.reject(new BadRequest("user Password is incorrect"));
      // }

      let hashedValue = await hashData(transactionPin);
      console.log(hashedValue, "hashedValue");
      userDetails.securityPin = hashedValue;
      await userDetails.save();
      return Promise.resolve(
        successMessage(null, "Transaction PIN updated successfully")
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

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
