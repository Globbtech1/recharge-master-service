/* eslint-disable no-unused-vars */
const sgMail = require("@sendgrid/mail");

exports.EmailService = class EmailService {
  constructor(options) {
    this.options = options || {};
    this.sendGrid = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
    const { receiverEmail, emailContent, subject } = data;

    try {
      const msg = {
        to: receiverEmail,
        from: {
          email: process.env.SENDGRID_FROM_MAIL,
          name: process.env.Email_FROM_NAME,
        }, // Use the email address or domain you verified above
        subject: subject,
        // text: "and easy to do anywhere, even with Node.js",
        html: emailContent,
        bcc: "dev.rechargemaster@gmail.com",
      };

      const response = await this.sendGrid.send(msg);
      return response;
    } catch (error) {
      console.log(error, "error");
      // throw new Error("Error sending Email:", error);
      return { error: "Email sending failed" };
    }

    // return data;
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
