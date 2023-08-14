// import Joi from "joi";
const Joi = require("joi");
// import { email, password, token } from "./common.validation";

const { email, password, token } = require("./common.validation");

const signupValidationSchema = (data) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(2).required(),
    fullName: Joi.string().trim().min(2).required(),
    phoneNumber: Joi.string().trim().min(2).required(),
    gender: Joi.string(),
    avatar: Joi.string(),
    email: email.required().required(),
  });

  return schema.validate(data, { allowUnknown: true });
};

const loginValidationSchema = (req, res, next) => {
  const schema = Joi.object({
    email: email.required(),
    password: password.required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) throw new Error(error.details[0].message);
  req.body = value;
  next();
};

const userAccountVerifyValidator = (data) => {
  const schema = Joi.object({
    email: email.required().required(),
    userCode: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const resendVerificationCodeValidator = (data) => {
  const schema = Joi.object({
    email: email.required().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const changeUserEmailValidator = (data) => {
  const schema = Joi.object({
    email: email.required().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const userEmailVerifyValidator = (data) => {
  const schema = Joi.object({
    email: email.required().required(),
    userCode: Joi.string().trim().min(2).required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  loginValidationSchema,
  signupValidationSchema,
  userAccountVerifyValidator,
  resendVerificationCodeValidator,
  changeUserEmailValidator,
  userEmailVerifyValidator,
};
