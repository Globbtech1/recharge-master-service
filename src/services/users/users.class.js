const { Service } = require("feathers-sequelize");
const { customLog } = require("../../dependency/customLoggers");
const { generateRandomNumber } = require("../../dependency/UtilityFunctions");
const { CONSTANT } = require("../../dependency/Config");

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
    const sequelize = this.app.get("sequelizeClient");
    console.log(newUser, "newUser");
    const { email, fullName, id: loggedInUserId } = newUser;
    const { users, user_verifications } = sequelize.models;
    const { phoneNumber, userPassword } = data;

    const verification_reference = await generateRandomNumber(
      user_verifications,
      "token",
      6,
      false
    );

    const now = new Date();
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours
    await this.app.service("user-verifications").create({
      token: verification_reference,
      userId: loggedInUserId,
      expiredAt: expirationDate,
      type: CONSTANT.verificationType.onWelcome, // 'type' field to distinguish email
      data: verification_reference,
    });

    if (phoneNumber) {
      let smsData = {
        phoneNumber: phoneNumber,
        message: `Welcome, Your verification code is ${verification_reference}`,
      };
      this.app.service("integrations/sms-service").create(smsData);
    }
    if (email) {
      // Define the email data
      const emailData = {
        receiverEmail: email,
        subject: "Welcome to Recharge Master",
        emailData: {
          customerName: fullName, // Replace with the user's name if available
          customMessage: `We welcome you to recharge master . A platform where you can do all your bills payment. \n please use this code to verify your account ${verification_reference}`,
          mailTitle: "Welcome to our Platform",
        },
        templateName: "default-email", // Specify the email template
      };

      // Send the verification email using the email service
      // try {
      await this.app.service("integrations/email-service").create(emailData);
    }
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
