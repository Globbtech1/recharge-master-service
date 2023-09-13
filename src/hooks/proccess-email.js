// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { SendEmail } = require("../dependency/commonRequest");
const {
  VerificationMailBodyContent,
  ChangeUserEmail,
  ResetPasswordMailBodyContent,
} = require("../dependency/templates/templates");
const { successMessage } = require("../dependency/UtilityFunctions");

// eslint-disable-next-line no-unused-vars
// const { SendEmail } = require('../dependency/commonRequest')
// const { VerificationMailBodyContent } = require('../../dependency/templates/templates')

module.exports = (options = {}) => {
  return async (context) => {
    // console.log(context, "context");
    // console.log(options, "options");
    const { mailtype } = options;
    const { result } = context;
    const { data } = context;
    let Payloads = {};
    let mailBody = "";
    let mailSubject = "";
    if (mailtype === "userCreation") {
      Payloads = {
        userEmail: result?.email,
        customerName: `${result?.fullName}`,
        verificationCode: data?.verificationCode,
      };

      mailBody = await VerificationMailBodyContent(Payloads);
      mailSubject = "Welcome to Recharge";
    }
    if (mailtype === "changeUserEmail") {
      const { userData, oldEmail, newEmail, code } = data;
      Payloads = {
        // userEmail: oldEmail,
        userEmail: newEmail,
        customerEmail: oldEmail,
        newEmail: newEmail,
        customerName: `${userData.firstName} ${userData.lastName} `,
        verificationCode: code,
      };

      mailBody = await ChangeUserEmail(Payloads);
      mailSubject = "Change User Email";
    }
    if (mailtype === "resetEmail") {
      Payloads = {
        userEmail: [
          {
            email: data.email,
            // name: "Admin HNS",
          },
        ],
        contentData: {
          code: data.code,
        },
      };
      mailBody = await ResetPasswordMailBodyContent(Payloads);
      mailSubject = "Reset Password";
      let response = successMessage(
        data.code,
        "verification code has been sent to your email or phone number"
      );
      // console.log(response);
      // context.result = { ...response };
    }

    SendEmail(Payloads, mailBody, mailSubject);

    return context;
  };
};
