// Initializes the `changeUserEmail` service on path `/change-user-email`
const { ChangeUserEmail } = require("./change-user-email.class");
const createModel = require("../../models/change-user-email.model");
const hooks = require("./change-user-email.hooks");
const { verifyUserEmailChange } = require("../../hooks/userManagement.hook");
// const { verifyUserEmailChange } = require("../../hooks/general-uses");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/change-user-email", new ChangeUserEmail(options, app));
  app.post("/change-user-email/verify", verifyUserEmailChange);

  // Get our initialized service so that we can register hooks
  const service = app.service("change-user-email");

  service.hooks(hooks);
};
