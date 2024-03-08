const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.UserReferralList = class UserReferralList {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async get(id, params) {
    const refererLink = id;
    if (!refererLink) {
      return Promise.reject(new BadRequest("user refererLink is required"));
    }
    const { user, query } = params;
    console.log(query, "parameter");

    let result = await this.app.service("users").find({
      query: {
        invitedBy: refererLink,
        deletedAt: null,
        $sort: {
          id: -1,
        },
      },
    });

    return Promise.resolve(successMessage(result, "User saved Beneficiary"));
  }
};
