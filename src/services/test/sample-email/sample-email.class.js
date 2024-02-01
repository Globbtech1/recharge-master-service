/* eslint-disable no-unused-vars */
exports.SampleEmail = class SampleEmail {
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
    const { email, messageBody, title } = data;
    let EmailSendingData = {
      receiverEmail: email,
      subject: "Sample Email",
      emailData: {
        customerName: "Sample Name",
        customMessage: messageBody,
        mailTitle: title,
      },
      templateName: "default-email",
    };

    return this.app
      .service("integrations/email-service")
      .create(EmailSendingData);
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
