const { BadRequest, NotFound } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  errorMessage,
  successMessage,
  hashData,
} = require("../../../dependency/UtilityFunctions");
const logger = require("../../../logger");

/* eslint-disable no-unused-vars */
exports.CreateTransactionPin = class CreateTransactionPin {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  // async find(params) {
  //   return [];
  // }

  // async get(id, params) {
  //   return {
  //     id,
  //     text: `A new message with ID: ${id}!`,
  //   };
  // }

  async create(data, params) {
    const { user } = params;
    const { pinNumber, confirmPinNumber } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (pinNumber.length !== CONSTANT.transactionPinSize) {
      throw new BadRequest(
        `Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
      );
    }
    if (confirmPinNumber.length !== CONSTANT.transactionPinSize) {
      throw new BadRequest(
        `Confirm Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
      );
    }
    if (pinNumber !== confirmPinNumber) {
      throw new BadRequest("Transaction PIN does not match");
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
      let hasPinNumberSet = userDetails.securityPin === null ? false : true;
      if (hasPinNumberSet) {
        return Promise.reject(new BadRequest("Transaction PIN already set"));
      }
      let hashedValue = await hashData(pinNumber);
      console.log(hashedValue, "hashedValue");
      userDetails.securityPin = hashedValue;
      await userDetails.save();
      return Promise.resolve(
        successMessage(null, "Transaction PIN Created  Successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while saving the Transaction PIn",
          error,
          500
        )
        // error
      );
    }

    // return data;
  }

  // async update(id, data, params) {
  //   return data;
  // }

  // async patch(id, data, params) {
  //   return data;
  // }

  // async remove(id, params) {
  //   return { id };
  // }
};
