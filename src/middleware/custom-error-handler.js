const { errorMessageV2 } = require("../dependency/UtilityFunctions");

// custom-error-handler.js
module.exports = (options = {}) => {
  // console.log("lllllllloooooooooooooooo");
  return (error, req, res, next) => {
    console.log(error, "oooooooooooooooo");
    console.log(error?.name, "oooooooooooooooommmmm");
    // Check if the error is a Feathers error
    const handledErrorNames = [
      "Error",
      "BadRequest",
      "NotAuthenticated",
      "GeneralError",
      "myCustomError",
      "TypeError",
      "NotFound",
    ];
    if (handledErrorNames.includes(error?.name)) {
      const statusCode = error?.code || 500;
      const ErrorMessage = error?.message;

      let responseData = errorMessageV2(ErrorMessage, error);

      // Customize the error response as needed
      res.status(statusCode).json(responseData);
    } else {
      // If it's not a Feathers error, let the default Feathers error handler handle it
      next(error);
    }
  };
};
