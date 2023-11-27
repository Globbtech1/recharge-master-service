// Common validations that are reused
const Joi = require("joi");
// import joiObjectid from "joi-objectid";

//Joi.Objectid = joiObjectid(Joi);

const email = Joi.string().trim().email({ minDomainSegments: 2 });

const Id = Joi.number();

const password = Joi.string().trim().min(8);

const token = Joi.string();

const nigerianPhoneNumber = Joi.extend((joi) => ({
  type: "nigerianPhoneNumber",
  base: joi.string(),
  messages: {
    "nigerianPhoneNumber.invalid": "Invalid Nigerian phone number format",
  },
  validate(value, helpers) {
    // Regular expression for a valid Nigerian phone number format
    const regex = /^(\+234|0)[789]\d{9}$/;

    if (value.match(regex)) {
      return value; // The phone number is valid
    }

    return { value, errors: helpers.error("nigerianPhoneNumber.invalid") };
  },
}));

// export const objectId = Joi.Objectid();

module.exports = {
  email: email,
  token: token,
  password,
  Id,
  nigerianPhoneNumber,
};
