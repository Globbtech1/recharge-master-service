const { NotFound, BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  successMessage,
  errorMessage,
  convertToNaira,
  compareHashData,
} = require("../../../dependency/UtilityFunctions");
const { getUserAccountBalanceInfo } = require("../../../hooks/userFund.hook");
const logger = require("../../../logger");
/* eslint-disable no-unused-vars */
exports.DeleteUserAccount = class DeleteUserAccount {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  // async remove(id, params) {
  //   const { user } = params;
  //   const loggedInUserId = user?.id;
  //   const sequelize = this.app.get("sequelizeClient");
  //   const { users, account_balance } = sequelize.models;
  //   try {
  //     const userDetails = await users.findOne({
  //       where: {
  //         deletedAt: null,
  //         id: loggedInUserId,
  //       },
  //     });
  //     logger.info(userDetails, "userDetails");
  //     if (userDetails === null) {
  //       const notFound = new NotFound("User not found, please try again");
  //       return Promise.reject(notFound);
  //     }
  //     const userAccountBalance = await getUserAccountBalanceInfo(
  //       account_balance,
  //       loggedInUserId
  //     );
  //     console.log(userAccountBalance, "userAccountBalance");
  //     if (userAccountBalance != false) {
  //       let cashBackBalance = userAccountBalance?.cashBackBalance || 0;
  //       let balance = userAccountBalance?.balance || 0;

  //       if (balance > 0) {
  //         const errorMessage = new BadRequest(
  //           `You have the sum of ${convertToNaira(
  //             balance
  //           )} in your account. please make use of it before your account can be deleted`
  //         );
  //         return Promise.reject(errorMessage);
  //       }
  //       if (cashBackBalance > 0) {
  //         const errorMessage = new BadRequest(
  //           `You have the sum of ${convertToNaira(
  //             cashBackBalance
  //           )} in your cashback wallet. please transfer it to your main wallet and transact with it before your account can be deleted`
  //         );
  //         return Promise.reject(errorMessage);
  //       }
  //     }

  //     await this.app.service("users").remove(loggedInUserId);

  //     return Promise.resolve(
  //       successMessage(null, "User Account Deleted Successfully")
  //     );
  //   } catch (error) {
  //     logger.error("error", error);
  //     Promise.reject(
  //       errorMessage(
  //         "An error has occurred while removing your profile",
  //         error,
  //         500
  //       )
  //     );
  //   }
  // }

  async create(data, params) {
    console.log(data);
    //
    // return data;
    const { reason, userPassword } = data;
    const { user } = params;
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { users, account_balance } = sequelize.models;
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

      let passwordCorrect = await compareHashData(
        userPassword,
        userDetails.password
      );
      if (!passwordCorrect) {
        return Promise.reject(
          new BadRequest("user Password is incorrect \n please try again.")
        );
      }

      // const userAccountBalance = await getUserAccountBalanceInfo(
      //   account_balance,
      //   loggedInUserId
      // );
      // console.log(userAccountBalance, "userAccountBalance");
      // if (userAccountBalance != false) {
      //   let cashBackBalance = userAccountBalance?.cashBackBalance || 0;
      //   let balance = userAccountBalance?.balance || 0;

      //   if (balance > 0) {
      //     const errorMessage = new BadRequest(
      //       `You have the sum of ${convertToNaira(
      //         balance
      //       )} in your account. please make use of it before your account can be deleted`
      //     );
      //     return Promise.reject(errorMessage);
      //   }
      //   if (cashBackBalance > 0) {
      //     const errorMessage = new BadRequest(
      //       `You have the sum of ${convertToNaira(
      //         cashBackBalance
      //       )} in your cashback wallet. please transfer it to your main wallet and transact with it before your account can be deleted`
      //     );
      //     return Promise.reject(errorMessage);
      //   }
      // }

      await this.app.service("users").remove(loggedInUserId);

      return Promise.resolve(
        successMessage(null, "User Account Deleted Successfully")
      );
    } catch (error) {
      logger.error("error", error);
      Promise.reject(
        errorMessage(
          "An error has occurred while removing your profile",
          error,
          500
        )
      );
    }
  }
};
