/* eslint-disable no-unused-vars */
const {
  ElectricityPurchase,
} = require("../../../../interfaces/electricityPurchase");
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../../dependency/UtilityFunctions");

exports.VerifyMeterNumber = class VerifyMeterNumber {
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
