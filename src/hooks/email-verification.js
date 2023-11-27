// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const { SendEmail } = require("../dependency/commonRequest");
const {
  verifyUserEmailValidator,
  userVerificationValidator,
} = require("../validations/auth.validation");
const crypto = require("crypto"); // Import the crypto module

const validateEmailInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { error } = verifyUserEmailValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

const sendVerificationEmail = (options = {}) => {
  return async (context) => {
    const { app, data } = context;
    console.log(data, "data");
    const sequelize = app.get("sequelizeClient");

    const { users, payment_list: product } = sequelize.models;

    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hours
    let userEmail = data?.email;
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        email: userEmail,
      },
    });
    if (userDetails === null) {
      const notFound = new NotFound("User not found, please try again");
      // return Promise.reject(notFound);
      return res.status(404).json(notFound);
    }
    // const user = await app
    //   .service("users")
    //   .find({ query: { email: data?.email, deletedAt: null } });

    // if (!user || user.length === 0) {
    //   throw new BadRequest("User not found");
    // }
    // console.log(user, "vvvvvvvvv");
    // return;
    await app.service("email-verification").create({
      token,
      userId: user[0].id,
      expiredAt: expirationDate,
      type: "email", // 'type' field to distinguish email verification
    });

    const verificationLink = `https://rechargemaster.com/email-verification?token=${token}`;

    const mailBody = ```Click the link below to verify your email:\n\n${verificationLink}, 
                        <p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>```;

    const subject = "Email Verification";

    await SendEmail(data.email, mailBody, subject);

    context.result = { sent: true };
    return context;
  };
};
const validateVerificationInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { error } = userVerificationValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

module.exports = {
  sendVerificationEmail,
  validateEmailInput,
  validateVerificationInput,
};
