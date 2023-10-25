const { CONSTANT } = require("../../../dependency/Config");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.CouponUserCategory = class CouponUserCategory {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const UserCategory = CONSTANT.userCategories;

    return successMessage(UserCategory, "Coupon User category");
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
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
