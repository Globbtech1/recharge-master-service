const Joi = require("joi");

const buyElectricityValidator = (data) => {
  console.log(data, "data");
  const schema = Joi.object({
    phoneNumber: Joi.string().trim().min(2).required(),
    email: Joi.string().email().required(),
    meterNumber: Joi.string().trim().min(11).max(13).required(),
    amount: Joi.number().required(),
    provider: Joi.string().trim().min(2).required(),
    // fundSource: Joi.string().trim().min(2).required(),
    paymentId: Joi.number().required(),
    // saveBeneficiary: Joi.boolean().required(),
    // beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    // userPin: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

const verifyMeterNumberValidator = (data) => {
  const schema = Joi.object({
    meterNumber: Joi.string().trim().min(11).max(13).required(),
    provider: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

module.exports = { buyElectricityValidator, verifyMeterNumberValidator };
