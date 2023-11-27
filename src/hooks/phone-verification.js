// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest } = require("@feathersjs/errors");
const { sendSMS } = require("../dependency/commonRequest");
const { verifyUserPhoneNumberValidator } = require("../validations/auth.validation");

const validatePhoneNumberInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { error } = verifyUserPhoneNumberValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

const sendVerificationSMS = (options = {}) => {
  return async (context) => {
    const { app, data } = context
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await app.service("users").find({ query: { phoneNumber: data.phoneNumber } });

    if (!user || user.length === 0) {
      throw new BadRequest("User not found.");
    }

    await app.service("phone-verification").create({
      verificationCode,
      userId: user[0].id,
      type: "phone",          // 'type' field to distinguish phone verification
    });

    const body = `Your verification code is: ${verificationCode}`
    await sendSMS(data.phoneNumber, body);

    context.result = { sent: true };
    return context;
  }
};

module.exports = { sendVerificationSMS, validatePhoneNumberInput }