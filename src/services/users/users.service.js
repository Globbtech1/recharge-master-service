// Initializes the `users` service on path `/users`
const { Users } = require("./users.class");
const createModel = require("../../models/users.model");
const hooks = require("./users.hooks");
const {
  verifyUserAccount,
  resendVerificationCode,
} = require("../../hooks/general-uses");
const updateUserProfile = require("../../middleware/update-user-profile");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/users", new Users(options, app));

  app.post("/users/verify", verifyUserAccount);
  app.post("/users/resendCode", resendVerificationCode);
  // app.post("/signuptest", updateUserProfile(app));

  // Get our initialized service so that we can register hooks
  const service = app.service("users");

  service.hooks(hooks);
};
