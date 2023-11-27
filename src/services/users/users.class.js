const { Service } = require("feathers-sequelize");
const { customLog } = require("../../dependency/customLoggers");

exports.Users = class Users extends Service {
  //   console.log("hey here");
  //   return;
  constructor(options, app) {
    // this.options = options || {};
    super(options); // Call the constructor of the parent class

    this.app = app || {};
  }

  async create(data, params) {
    customLog(data, "data...");
    const newUser = await super.create(data, params);
    console.log(newUser, "newUser");
    const { email, fullName } = newUser;
    // Define the email data
    const emailData = {
      receiverEmail: email,
      subject: "Welcome to Recharge Master",
      emailData: {
        customerName: fullName, // Replace with the user's name if available
        customMessage: `we welcome you to recharge master . A platform where you can do all your bills payment.`,
        mailTitle: "Welcome to our Platform",
      },
      templateName: "default-email", // Specify the email template
    };

    // Send the verification email using the email service
    // try {
    await this.app.service("integrations/email-service").create(emailData);
    const { phoneNumber, userPassword } = data;
    let loginDetails = {
      phoneNumber: phoneNumber,
      password: userPassword,
      strategy: "local",
    };
    const loginResponse = await this.app
      .service("authentication")
      .create(loginDetails);
    newUser.loginData = loginResponse;
    return newUser;
  }
};
