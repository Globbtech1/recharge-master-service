// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { buyAirtimeValidator } = require("../validations/airtime.validation");
const { buyDataValidator } = require("../validations/data.validation");
require("../validations/electricity.validation");
const {
  setSecurityNumberValidator,
  updateSecurityNumberValidator,
  changePasswordValidator,
} = require("../validations/transactions.validation");
const {
  fetchTvProviderBundlesValidator,
  fetchTvProviderProductTypeBundlesValidator,
  customerValidationValidator,
  tvSubscriptionValidator,
} = require("../validations/tv-subscription.validation");
const {
  buyAirtimeValidator: guestBuyAirtimeValidator,
} = require("../validations/guest-airtime.validation");
const {
  buyDataValidator: guestBuyDataValidator,
} = require("../validations/guest-data.validation");
const {
  buyElectricityValidator: guestBuyElectricityValidator,
  verifyMeterNumberValidator: verifyGuestMeterNumberValidator,
} = require("../validations/guest-electricity.validation");
const {
  fetchTvProviderBundlesValidator: guestFetchTvProviderBundlesValidator,
  fetchTvProviderProductTypeBundlesValidator:
    guestFetchTvProviderProductTypeBundlesValidator,
  customerValidationValidator: guestCustomerValidationValidator,
  tvSubscriptionValidator: guestTvSubscriptionValidator,
} = require("../validations/guest-tv-subscription.validation");
const {
  resetPasswordValidationSchema,
} = require("../validations/auth.validation");
const {
  validateAddProductListSchema,
} = require("../validations/product.validation");
const { BadRequest } = require("@feathersjs/errors");
const { isDateGreaterThanToday } = require("./rule.general.validator");
const Joi = require("joi");

// eslint-disable-next-line no-unused-vars

const validateAddNewCouponInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const couponSchema = Joi.object({
      userCategory: Joi.string().required(),
      couponCode: Joi.string().required(),
      couponValue: Joi.number().min(0).required(),
      minimumRecharge: Joi.number().min(0).required(),
      maximumRecharge: Joi.number().min(0).required(),
      validity: Joi.date()
        .custom(isDateGreaterThanToday, "greater than today")
        .allow(null)
        .optional(),

      commencement: Joi.date().allow(null).optional(),
    });
    const { error } = couponSchema.validate(data);

    // const { error } = validateAddProductListSchema(data);
    if (error) {
      // throw new Error(error.details[0].message);
      throw new BadRequest(
        error.details.map((detail) => detail.message).join(", ")
      );
    }
    return context;
  };
};

module.exports = {
  validateAddNewCouponInput,
};
