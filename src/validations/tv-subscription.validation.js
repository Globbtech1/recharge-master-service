const Joi = require("joi");

const fetchTvProviderBundlesValidator = (data) => {
  const schema = Joi.object({
    provider: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const fetchTvProviderProductTypeBundlesValidator = (data) => {
  const schema = Joi.object({
    productTypeName: Joi.string().trim().min(2).required(),
    productTypes: Joi.array()
      .items(
        Joi.object({
          a: Joi.array(),
          b: Joi.string(),
          c: Joi.string(),
        })
      )
      .required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

const customerValidationValidator = (data) => {
  const schema = Joi.object({
    provider: Joi.string().trim().min(2).required(),
    decoder_number: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

const tvSubscriptionValidator = (data) => {
  const schema = Joi.object({
    provider: Joi.string().trim().min(2).required(),
    decoderNumber: Joi.string().trim().min(2).required(),
    amount: Joi.number().required(),
    bouquet: Joi.string().trim().min(2).required(),
    productMonthsPaidFor: Joi.number().min(1).max(12).required(),
    fundSource: Joi.string().trim().min(2).required(),
    paymentId: Joi.number().required(),
    saveBeneficiary: Joi.boolean().required(),
    beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    userPin: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  fetchTvProviderBundlesValidator,
  fetchTvProviderProductTypeBundlesValidator,
  customerValidationValidator,
  tvSubscriptionValidator,
};
