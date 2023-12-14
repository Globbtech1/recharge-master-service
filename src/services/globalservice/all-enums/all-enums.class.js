const { CONSTANT } = require("../../../dependency/Config");

/* eslint-disable no-unused-vars */
exports.AllEnums = class AllEnums {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    let userEnums = { ...CONSTANT }; // Create a copy to avoid modifying the original object

    // Properties to exclude
    const excludedProperties = [
      "maximumAmountForUnverifiedAccount",
      "status",
      "RESERVED_ACCOUNT",
      "WEB_SDK",
      "AccountFunding",
      "successMessage",
      "transactionPinSize",
      "transactionalMailContent",
      "PasswordRegex",
      "externalRequestFailErrorMessage",
    ];

    // Remove excluded properties
    userEnums = Object.fromEntries(
      Object.entries(userEnums).filter(
        ([key]) => !excludedProperties.includes(key)
      )
    );

    return [userEnums];
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
