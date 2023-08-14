// import Joi from "joi";
const Joi = require("joi");

const buyDataValidator = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().trim().min(2).required(),
    email: Joi.string().email(),
    amount: Joi.number().required(),
    provider: Joi.string().trim().min(2).required(),
    // fundSource: Joi.string().trim().min(2).required(),
    paymentId: Joi.number().required(),
    // saveBeneficiary: Joi.boolean().required(),
    // beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    // userPin: Joi.string().trim().min(2).required(),
    dataCode: Joi.string().trim().min(2).required(),
    name: Joi.string().trim().min(2).required(),
  });

  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  buyDataValidator,
};
