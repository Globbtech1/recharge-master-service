const { Service } = require("feathers-sequelize");

exports.Users = class Users extends Service {
  //   console.log("hey here");
  //   return;
  constructor(options, app) {
    // this.options = options || {};
    super(options); // Call the constructor of the parent class

    this.app = app || {};
  }

  async create(data, params) {
    const newUser = await super.create(data, params);
    console.log(newUser, "newUser");
    const { email, fullName } = newUser;
    // Send a welcome email to the new user
    // const emailService = this.app.service("integrations/email-service");

    // const emailData = {
    //   receiverEmail: newUser.email, // User's email address
    //   subject: "Welcome to Our Platform",
    //   emailContent: "<p>...</p>", // HTML content for the welcome email
    // };

    // // Call the email service to send the welcome email
    // await emailService.create(emailData);

    //   const { email, code } = data;

    // //   userEmail: result?.email,
    // //     customerName: `${result?.fullName}`,
    // //     verificationCode: data?.verificationCode,

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

    return newUser;
  }
};
