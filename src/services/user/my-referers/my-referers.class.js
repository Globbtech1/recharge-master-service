const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.MyReferers = class MyReferers {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { query, user } = params;
      const loggedInUserId = user?.id;

      // const myReferrers = await users.findAll({
      //   where: {
      //     deletedAt: null,
      //     invitedBy: refererLink,
      //   },
      // });

      let myReferrers = await this.app
        .service("user-referral-list-bonus")
        .find({
          query: {
            // userId: loggedInUserId,
            userId: 46,
            deletedAt: null,
            $sort: {
              id: -1,
            },
          },
        });
      return Promise.resolve(successMessage(myReferrers, "My referrers"));
    } catch (error) {
      console.log(error, "error");
      return Promise.reject(
        new BadRequest("unable to retrieve data Providers")
      );
    }
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
