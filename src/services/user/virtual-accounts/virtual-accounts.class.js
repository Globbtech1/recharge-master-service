const fErrors = require("@feathersjs/errors");
const {
  successMessage,
  systemConfig,
  convertToNaira,
} = require("../../../dependency/UtilityFunctions");
/* eslint-disable no-unused-vars */
exports.VirtualAccounts = class VirtualAccounts {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { users, generateaccount, account_balance } = sequelize.models;
      const { query } = params;
      let loggedInUserId = params?.user?.id;
      // console.log(loggedInUserId, "loggedInUserId");
      const userVirtualAccount = await generateaccount.findAll({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
        },
        attributes: {
          exclude: [
            "deletedAt",
            "createdAt",
            "updatedAt",
            "otherDetails",
            "accountReference",
            "userId",
            "id",
          ],
        },
        include: [
          {
            model: users,
            // raw: false,

            attributes: ["lastName", "firstName"],
            // where: {
            //   deletedAt: null,
            // },
          },
        ],
      });

      return Promise.resolve(
        successMessage(userVirtualAccount, "User virtual Account ")
      );
    } catch (error) {
      console.log(error, "error");
      throw new fErrors.NotFound("User profile not found");
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
