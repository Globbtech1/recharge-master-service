/* eslint-disable no-unused-vars */
exports.SampleSms = class SampleSms {
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
    const { phoneNumber, message } = data;
    let smsData = {
      phoneNumber: phoneNumber,
      message: message,
    };
    return this.app.service("integrations/sms-service").create(smsData);
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
