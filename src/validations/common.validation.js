// Common validations that are reused
const Joi = require('joi');
// import joiObjectid from "joi-objectid";

//Joi.Objectid = joiObjectid(Joi);

const email = Joi.string().trim().email({ minDomainSegments: 2 });

const Id = Joi.number();

const password = Joi.string().trim().min(8);

const token = Joi.string();



// export const objectId = Joi.Objectid();

module.exports = { email: email, token: token, password, Id };
