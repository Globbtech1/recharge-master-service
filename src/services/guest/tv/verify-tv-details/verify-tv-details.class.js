/* eslint-disable no-unused-vars */
const logger = require("../../../../logger");
const { TvSubscription } = require("../../../../interfaces/tvSubscription");
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../../dependency/UtilityFunctions");

exports.VerifyTvDetails = class VerifyTvDetails {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {try {
    let tvSubPurchase = new TvSubscription();
    let validateCustomerResponse = await tvSubPurchase.validateCustomerDetail(
      data
    );
    
    return Promise.resolve(
      successMessage(
        validateCustomerResponse,
        "Customer  details fetched successfully"
      )
    );
  } catch (error) {
    logger.error("error", error);
    return Promise.reject(
      new BadRequest("unable to fetch customer  details")
    );
  }
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
