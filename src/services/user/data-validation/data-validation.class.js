const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.DataValidation = class DataValidation {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async create(data) {
    try {
      const { value, type } = data;
      const sequelize = this.app.get("sequelizeClient");
      const { users } = sequelize.models;

      const user = await users.findOne({
        where: {
          deletedAt: null,
          [type]: value,
        },
      });

      if (user) {
        let resp = {
          isUserExist: true,
        };
        return Promise.resolve(successMessage(resp, "User exist"));
      } else {
        let resp = {
          isUserExist: false,
        };
        return Promise.resolve(successMessage(resp, "User does not exist"));
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error while checking user existence:", error);
      return {
        success: false,
        message: "An error occurred while checking user existence",
        error: error.message, // Optionally, include error details
      };
    }
  }
};
