// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const { SendEmail } = require("../dependency/commonRequest");
const {
  verifyUserEmailValidator,
  userVerificationValidator,
} = require("../validations/auth.validation");
const crypto = require("crypto"); // Import the crypto module
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const prepareEmailTemplate = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { templateName = "default-email", emailData } = data;
    const templatePath = path.join(
      __dirname,
      "../",
      "emailTemplates",
      // "default-email.hbs"
      `${templateName}.hbs`
    );

    console.log(templatePath, "templatePath");
    const templateSource = fs.readFileSync(templatePath, "utf8");

    // Compile the Handlebars template
    const template = handlebars.compile(templateSource);

    // Data for the email
    // const emailData = {
    //   customerName: "John Doe",
    //   customMessage: "Thank you for joining our platform!",
    // };

    // Render the email content
    const emailContent = template(emailData);

    let AdditionalData = {
      emailContent,
    };

    context.data = { ...context.data, ...AdditionalData };

    return context;
  };
};
const sendInitiatePasswordResetEmail = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    // const verificationLink = `${process.env.WEBSITE_HOSTING}/email-verification?token=${token}`;
    const { code, userDetails } = data;
    console.log(userDetails, "userDetails");
    const { phoneNumber, email } = userDetails;
    if (phoneNumber) {
      let smsData = {
        phoneNumber: phoneNumber,
        message: `Your verification code is ${code}`,
      };
      context.app.service("integrations/sms-service").create(smsData);
    }
    if (email) {
      const emailData = {
        receiverEmail: email,
        subject: "Forgot Password ",
        emailData: {
          customerName: "", // Replace with the user's name if available
          customMessage: ` We just received a request from you to reset your login password\n
        please kindly use this code  - ( ${code}) to reset your login details
        `,
          mailTitle: "Reset login credential",
        },
        templateName: "default-email", // Specify the email template
      };

      // Send the verification email using the email service
      // try {
      await context.app.service("integrations/email-service").create(emailData);
    }

    // } catch (error) {
    //   // Handle email sending error
    //   console.error("Error sending verification email:", error);
    //   throw new Error("Email sending failed");
    // }

    return context;
  };
};

module.exports = {
  prepareEmailTemplate,
  sendInitiatePasswordResetEmail,
};
