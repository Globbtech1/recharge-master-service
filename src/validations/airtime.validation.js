// import Joi from "joi";
const Joi = require("joi");

const { email, password, token } = require("./common.validation");

const buyAirtimeValidator = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().trim().min(2).required(),
    productId: Joi.number().required(),
    amount: Joi.number().required(),
    // provider: Joi.string().trim().min(2).required(),
    // fundSource: Joi.string().trim().min(2).required(),
    //paymentId: Joi.number().required(),
    saveBeneficiary: Joi.boolean().required(),
    beneficiaryAlias: Joi.string().optional().trim().min(2).allow(null, ""),
    userPin: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const setSecurityNumberValidator = (data) => {
  const schema = Joi.object({
    securityNumber: Joi.number().required(),
    confirmSecurityNumber: Joi.number().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const updateSecurityNumberValidator = (data) => {
  const schema = Joi.object({
    oldSecurityNumber: Joi.number().required(),
    securityNumber: Joi.number().required(),
    confirmSecurityNumber: Joi.number().required(),
    userPassword: Joi.string().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const changePasswordValidator = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
module.exports = {
  buyAirtimeValidator,
  // setSecurityNumberValidator,
  // updateSecurityNumberValidator,
  // changePasswordValidator,
};
