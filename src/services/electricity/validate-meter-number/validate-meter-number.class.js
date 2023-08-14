const {
  ElectricityPurchase,
} = require("../../../interfaces/electricityPurchase");
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.ValidateMeterNumber = class ValidateMeterNumber {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {}
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
    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const { provider, meterNumber } = data;
    // console.log(data, "ihunna");
    try {
      const electricityPurchase = new ElectricityPurchase();
      const verifyMeterNumberResponse =
        await electricityPurchase.verifyMeterNumber(data);

      return Promise.resolve(
        successMessage(
          verifyMeterNumberResponse,
          "Meter number verified successfully"
        )
      );
    } catch (error) {
      let errorMessage =
        error?.response?.data?.error?.message ||
        "Unable to process your request";
      console.error("An error occurred: ", error.message);
      return Promise.reject(new BadRequest(errorMessage));
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
