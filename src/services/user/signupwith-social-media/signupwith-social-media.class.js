const { CONSTANT } = require("../../../dependency/Config");

/* eslint-disable no-unused-vars */
exports.SignupwithSocialMedia = class SignupwithSocialMedia {
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
    //     if (Array.isArray(data)) {
    //       return Promise.all(data.map(current => this.create(current, params)));
    //     }
    // retunr
    //     // return data;

    console.log(data, "data");
    // return;
    // let updatedData = { ...data };
    // const provider = data.provider;
    data.password = CONSTANT.defaultPassword;

    console.log(data, "ppp");
    let responseTransaction = await this.app.service("users").create(data);
    return responseTransaction;
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
