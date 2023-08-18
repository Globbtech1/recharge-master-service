// import Joi from "joi";
const Joi = require("joi");

const { email, password, token } = require("./common.validation");

const postArticleValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).required(),
    authorId: Joi.number().required(),
    blogcatId: Joi.number().required(),
    tags: Joi.string().trim().min(2).required(),
    readTime: Joi.string().trim().min(2).required(),
    content: Joi.string().trim().min(2).required(),
    articleBanners: Joi.array().items(Joi.string()).required(),
    // allowComment: Joi.boolean().required(),
  });
  return schema.validate(data, { allowUnknown: true });
};
const setSecurityNumberValidator = (data) => {
  const schema = Joi.object({
    pinNumber: Joi.number().required(),
    confirmPinNumber: Joi.number().required(),
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
  postArticleValidator,
  setSecurityNumberValidator,
  updateSecurityNumberValidator,
  changePasswordValidator,
};
