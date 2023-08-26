// import Joi from "joi";
const Joi = require("joi");

const {
  email,
  password,
  token,
  nigerianPhoneNumber,
} = require("./common.validation");

const validateAddProductSchema = (data) => {
  const schema = Joi.object({
    productName: Joi.string().trim().min(2).required(),
    image: Joi.string().uri().required(), // Validate as a URI
  });

  return schema.validate(data, { allowUnknown: true });
};
const validateAddProductListSchema = (data) => {
  const schema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    productName: Joi.string().trim().min(2).required(),
    image: Joi.string().allow(null), // Allow null or a string
    allowedDiscount: Joi.number().positive().required(),
  });

  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  validateAddProductSchema,
  validateAddProductListSchema,
};
