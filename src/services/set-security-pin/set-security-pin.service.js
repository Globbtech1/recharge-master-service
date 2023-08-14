// Initializes the `setSecurityPin` service on path `/set-security-pin`
const { SetSecurityPin } = require("./set-security-pin.class");
const hooks = require("./set-security-pin.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/set-security-pin", new SetSecurityPin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("set-security-pin");

  service.hooks(hooks);
};
