// Initializes the `userVerifications` service on path `/user-verifications`
const { UserVerifications } = require("./user-verifications.class");
const createModel = require("../../models/user-verifications.model");
const hooks = require("./user-verifications.hooks");
const { verifyUserAccount } = require("../../hooks/general-uses");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-verifications", new UserVerifications(options, app));
  app.post("/users/verify", verifyUserAccount);

  // Get our initialized service so that we can register hooks
  const service = app.service("user-verifications");

  service.hooks(hooks);
};
