const { NotFound, BadRequest } = require("@feathersjs/errors");
const Joi = require("joi");
const { Sequelize } = require("sequelize");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.RedemCoupon = class RedemCoupon {
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
    const { couponCode, productAmount, couponDetails } = data;
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");

    const { users, coupon_management } = sequelize.models;

    try {
      // Return the new discounted product amount
      return Promise.resolve(
        successMessage(couponDetails, "Discount Calculated")
      );
    } catch (error) {
      console.error("error", error);
      let catchError = new BadRequest(
        "An error Occurred while getting coupon",
        error
      );
      return Promise.reject(catchError);
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
