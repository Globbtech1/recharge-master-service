// const { authenticate } = require("@feathersjs/express");
const { authenticate } = require("@feathersjs/authentication").hooks;
// const auth = require("feathers-authentication").hooks;
const { successMessage } = require("../dependency/UtilityFunctions");

module.exports = (app) => {
  return function updateUserProfile(req, res, next) {
    // console.log(req.feathers?.headers, "req.body");
    // console.log(req, "req.body");

    // next();
    // authenticate.verifyToken();
    // auth.populateUser(),
    // if (app.passport.verifyJWT) {
    //   console.log("authenticate.verifyToken()");
    // } else {
    //   console.log("???authenticate.verifyToken()");
    // }
    app
      .service("users")
      .patch(6, { firstName: "omoii" })
      // Then redirect to the login page
      .then((user) => {
        return res
          .status(200)
          .json(successMessage(user, "Verification code sent  successfully"));
      })
      // On errors, just call our error middleware
      // .catch(next)
      .catch((err) => {
        console.log(err, "err");
      });
  };
};
