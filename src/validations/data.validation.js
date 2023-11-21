// import Joi from "joi";
const Joi = require("joi");

const buyDataValidator = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().trim().min(2).required(),
    amount: Joi.number().required(),
    productId: Joi.number().required(),
    // provider: Joi.string().trim().min(2).required(),
    // fundSource: Joi.string().trim().min(2).required(),
    // paymentId: Joi.number().required(),
    saveBeneficiary: Joi.boolean().required(),
    beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    userPin: Joi.string().trim().min(2).required(),
    dataCode: Joi.string().trim().min(2).required(),
    name: Joi.string().trim().min(2).required(),
    paymentMethod: Joi.string().valid("wallet", "paystack").required(),
    paymentReference: Joi.when("paymentMethod", {
      is: "paystack",
      then: Joi.string().trim().min(2).required(),
      otherwise: Joi.optional(),
    }),
  });

  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  buyDataValidator,
};
