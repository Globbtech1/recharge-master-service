// import Joi from "joi";
const Joi = require("joi");

const {
  email,
  password,
  token,
  nigerianPhoneNumber,
} = require("./common.validation");

const signupValidationSchema = (data) => {
  data.phoneNumber = data.phoneNumber.replace(/^\+234/, "0");

  const schema = Joi.object({
    password: Joi.string()
      .min(8) // You can adjust the minimum length as needed
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
        "any.required": "Password is required",
      }),
    fullName: Joi.string().trim().min(2).required(),
    // phoneNumber: Joi.string()
    //   .pattern(/^[0-9]+$/) // Adjust the pattern as needed
    //   .required()
    //   .messages({
    //     "string.pattern.base": "Phone number must contain only digits",
    //     "any.required": "Phone number is required",
    //   }),
    phoneNumber: nigerianPhoneNumber.nigerianPhoneNumber().required(),

    gender: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email address is required",
    }),
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
const resetPasswordValidationSchema = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8) // You can adjust the minimum length as needed
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
        "any.required": "Password is required",
      }),
    emailOrPhoneNumber: Joi.string().required(),
    code: Joi.string().required(),
  });

  return schema.validate(data, { allowUnknown: true });
};

const verifyUserEmailValidator = (data) => {
  const schema = Joi.object({
    email: email.required().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};

const verifyUserPhoneNumberValidator = (data) => {
  const schema = Joi.object({
    phoneNumber: nigerianPhoneNumber.required().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const userVerificationValidator = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    platform: Joi.string().required(),
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
  resetPasswordValidationSchema,
  verifyUserEmailValidator,
  verifyUserPhoneNumberValidator,
  userVerificationValidator,
};
