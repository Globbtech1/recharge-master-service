const { NotFound, BadRequest } = require("@feathersjs/errors");
const {
  successMessage,
  errorMessage,
  compareHashData,
  hashData,
} = require("../../dependency/UtilityFunctions");
const logger = require("../../logger");

/* eslint-disable no-unused-vars */
exports.ChangeUserPassword = class ChangeUserPassword {
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
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    const { user } = params;
    const { oldPassword, newPassword, confirmPassword } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (oldPassword === newPassword) {
      throw new BadRequest("New password cannot be same as old password");
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequest("New password does not match");
    }

    const { users } = sequelize.models;
    try {
      const userDetails = await users.findOne({
        where: {
          deletedAt: null,
          id: loggedInUserId,
        },
      });
      if (userDetails === null) {
        const notFound = new NotFound("User not found, please try again");
        return Promise.reject(notFound);
      }
      // let hasSecurityNumberSet =
      //   userDetails.securityPin === null ? false : true;
      // if (hasSecurityNumberSet === false) {
      //   return Promise.reject(new BadRequest("Security number not set"));
      // }
      // let oldSecurityNumberCorrect = await compareHashData(
      //   oldSecurityNumber,
      //   userDetails.securityPin
      // );
      // console.log(oldSecurityNumberCorrect, "oldSecurityNumberCorrect");
      // if (!oldSecurityNumberCorrect) {
      //   return Promise.reject(
      //     new BadRequest("Old security number is incorrect")
      //   );
      // }
      let passwordCorrect = await compareHashData(
        oldPassword,
        userDetails.password
      );
      if (!passwordCorrect) {
        return Promise.reject(new BadRequest("user Password is incorrect"));
      }

      let hashedValue = await hashData(newPassword);
      console.log(hashedValue, "hashedValue");
      userDetails.password = hashedValue;
      await userDetails.save();
      return Promise.resolve(
        successMessage(null, "Password updated successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage("Something went wrong, please try again later", error, 500)
      );
    }
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
