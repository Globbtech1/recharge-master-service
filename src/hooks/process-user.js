// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { signupValidationSchema } = require("../validations/auth.validation");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { data } = context;
    // console.log(data, "data");
    // SendEmail
    const { error } = signupValidationSchema(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    return context;
  };
};
