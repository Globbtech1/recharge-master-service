const { BadRequest, GeneralError } = require("@feathersjs/errors");
const { successMessage } = require("../../dependency/UtilityFunctions");
const ferrors = require("@feathersjs/errors");

/* eslint-disable no-unused-vars */
exports.UpdateUserProfile = class UpdateUserProfile {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async patch(id, data, params) {
    // remove email from data
    const { query } = params;
    delete data.email;
    delete data.securityPin;
    delete data.password;
    delete data.phoneNumber;
    try {
      let loggedInUserId = query?.id;
      return await this.app.service("users").patch(loggedInUserId, data);
    } catch (error) {
      throw new ferrors.NotFound("User profile not found");
    }
  }

  async remove(id, params) {
    return { id };
  }
};
