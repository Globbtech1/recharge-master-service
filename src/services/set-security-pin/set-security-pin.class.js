const logger = require("../../logger");
const { BadRequest, NotFound } = require("@feathersjs/errors");
const {
  successMessage,
  errorMessage,
  hashData,
} = require("../../dependency/UtilityFunctions");
const { CONSTANT } = require("../../dependency/Config");

/* eslint-disable no-unused-vars */
exports.SetSecurityPin = class SetSecurityPin {
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
    const { securityNumber, confirmSecurityNumber } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (securityNumber.length !== CONSTANT.transactionPinSize) {
      throw new BadRequest(
        `Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
      );
    }
    if (confirmSecurityNumber.length !== CONSTANT.transactionPinSize) {
      throw new BadRequest(
        `Confirm Transaction PIN must be ${CONSTANT.transactionPinSize} digits`
      );
    }
    if (securityNumber !== confirmSecurityNumber) {
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
      let hasSecurityNumberSet =
        userDetails.securityPin === null ? false : true;
      if (hasSecurityNumberSet) {
        return Promise.reject(new BadRequest("Transaction PIN already set"));
      }
      let hashedValue = await hashData(securityNumber);
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
