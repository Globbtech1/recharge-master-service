// import Joi from "joi";
const Joi = require("joi");

const { email, password, token } = require("./common.validation");

const buyAirtimeValidator = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().trim().min(2).required(),
    email: Joi.string().email(),
    amount: Joi.number().min(100).required(),
    provider: Joi.string().trim().min(2).required(),
    paymentId: Joi.number().required(),
    // fundSource: Joi.string().trim().min(2).required(),
    // saveBeneficiary: Joi.boolean().required(),
    // beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    // userPin: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
module.exports = {
  buyAirtimeValidator,
};
