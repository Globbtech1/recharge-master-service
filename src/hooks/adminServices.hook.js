// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const Sentry = require("@sentry/node");

const { Op } = require("sequelize");
const {
  generateRandomNumber,
  errorMessage,
  successMessage,
  generateRandomString,
  ShowCurrentDate,
  convertToNaira,
  convertToKobo,
  getProviderSourceImage,
  compareHashData,
  removeSensitiveKeys,
  calculateBillNextExecutionDate,
} = require("../dependency/UtilityFunctions");

const {
  changeUserEmailValidator,
  userEmailVerifyValidator,
} = require("../validations/auth.validation");
const { ReserveBankAccount, pushSlackNotification } = require("./general-uses");
const { getUserAccountBalanceInfo } = require("./userFund.hook");

// eslint-disable-next-line no-unused-vars
const generateCouponNumber = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { coupon_management, generateaccount } = sequelize.models;

    // let loggedInUser = params.user.id;
    const { couponCode } = data;
    if (!couponCode || couponCode === "") {
      const couponCodeGenerated = await generateRandomNumber(
        coupon_management,
        "couponCode",
        8,
        true
      );
      let AdditionalData = {
        couponCode: couponCodeGenerated,
      };

      context.data = { ...context.data, ...AdditionalData };
    }

    return context;
  };
};

module.exports = {
  generateCouponNumber,
};
