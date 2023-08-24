/* eslint-disable no-unused-vars */
const ferrors = require("@feathersjs/errors");
const {
  successMessage,
  systemConfig,
  convertToNaira,
} = require("../../dependency/UtilityFunctions");
const { getUserAccountBalanceInfo } = require("../../hooks/userFund.hook");

exports.UserProfile = class UserProfile {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async get(id, params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { users, generateaccount, account_balance } = sequelize.models;
      const { query } = params;
      let loggedInUserId = query?.id;
      console.log(loggedInUserId, "loggedInUserId");
      // return await this.app.service("users").patch(loggedInUserId, data);
      // let userProfile = await this.app.service("users").get(loggedInUserId);
      const usersProfile = await users.findOne({
        where: {
          deletedAt: null,
          id: loggedInUserId,
        },
        // raw: true,
        attributes: {
          exclude: [
            "deletedAt",
            "createdAt",
            "updatedAt",
            "deviceId",
            "fcmToken",
            "password",
          ],
        },
        // include: [
        //   {
        //     // model: propertyInteriors,
        //     model: generateaccount,
        //     // raw: false,

        //     attributes: {
        //       exclude: [
        //         "deletedAt",
        //         "status",
        //         "accountReference",
        //         "userId",
        //         "createdAt",
        //         "updatedAt",
        //         "otherDetails",
        //       ],
        //     },

        //     where: {
        //       deletedAt: null,
        //     },
        //   },
        // ],
      });
      // const userAccountBalance = await account_balance.findOne({
      //   where: {
      //     deletedAt: null,
      //     userId: loggedInUserId,
      //   },
      //   attributes: {
      //     exclude: [
      //       "deletedAt",
      //       "createdAt",
      //       "updatedAt",
      //       "deviceId",
      //       "fcmToken",
      //       "password",
      //     ],
      //   },
      // });
      const userAccountBalance = await getUserAccountBalanceInfo(
        account_balance,
        loggedInUserId
      );
      console.log(userAccountBalance, "userAccountBalance");
      let userBalance = {
        accountBalance: 0,
        ledgerBalance: 0,
        cashBackBalance: 0,
      };
      if (userAccountBalance != false) {
        let accountBalance = userAccountBalance?.balance || 0;
        let ledgerBalance = userAccountBalance?.ledgerBalance || 0;
        let cashBackBalance = userAccountBalance?.cashBackBalance || 0;
        userBalance = {
          accountBalance: convertToNaira(accountBalance),
          // ledgerBalance: convertToNaira(ledgerBalance),
          // cashBackBalance: convertToNaira(cashBackBalance),
        };
      }

      let resp = JSON.stringify(usersProfile);
      let userProfile = JSON.parse(resp);
      console.log(userProfile, "userProfile");
      userProfile.verified =
        userProfile?.isVerify === 1 || userProfile?.isVerify === true
          ? true
          : false;

      userProfile.setTransactionPin =
        userProfile?.securityPin !== null ? true : false;

      // userProfile.systemConfig = systemConfig;
      userProfile.accountBalance = userBalance;
      delete userProfile.securityPin;
      delete userProfile.id;
      delete userProfile.verified;
      return Promise.resolve(
        successMessage(userProfile, "logged in user profile information")
      );
    } catch (error) {
      console.log(error, "error");
      throw new ferrors.NotFound("User profile not found");
    }
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
