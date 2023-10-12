/* eslint-disable no-unused-vars */
const sgMail = require("@sendgrid/mail");

exports.EmailService = class EmailService {
  constructor(options) {
    this.options = options || {};
    this.sendGrid = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async create(data, params) {
    const { receiverEmail, emailContent, subject } = data;

    try {
      // const bccEmails = [
      //   "dev.rechargemaster@gmail.com",
      //   "another@example.com",
      //   "jinaddavid@gmail.com",
      // ];
      // Add the email addresses you want to BCC here
      const bccEmails = process.env.BCC_EMAILS?.split(",");

      const msg = {
        to: receiverEmail,
        from: {
          email: process.env.SENDGRID_FROM_MAIL,
          name: process.env.Email_FROM_NAME,
        }, // Use the email address or domain you verified above
        subject: subject,
        // text: "and easy to do anywhere, even with Node.js",
        html: emailContent,
        bcc: bccEmails,
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
};
