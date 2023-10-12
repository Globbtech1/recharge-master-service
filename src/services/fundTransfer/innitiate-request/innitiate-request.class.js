const { NotFound, BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.InnitiateRequest = class InnitiateRequest {
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
    const { walletId } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (!walletId || walletId === "") {
      // Promise.reject(new BadRequest("Enter user wallet Id "));
      throw new BadRequest(`Enter user wallet Id`);
    }
    const { users } = sequelize.models;
    try {
      const userWalletDetails = await users.findOne({
        where: {
          deletedAt: null,
          walletId: walletId,
        },
      });
      if (userWalletDetails === null) {
        const notFound = new NotFound(
          "You have entered an invalid wallet id. please check and try again "
        );
        return Promise.reject(notFound);
      }
      if (userWalletDetails?.id === loggedInUserId) {
        const notFound = new BadRequest("You can not transfer to self wallet");
        return Promise.reject(notFound);
      }

      let dataResponse = {
        accountName: userWalletDetails?.fullName,
      };
      return Promise.resolve(
        successMessage(dataResponse, "Wallet id Verified successfully")
      );
    } catch (error) {
      logger.error("error", error);
      const cachedError = new Error(
        `An error Occurred while trying to initiate fund transfer`
      );
      return Promise.reject(cachedError);
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
