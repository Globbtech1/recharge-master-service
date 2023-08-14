// Initializes the `guest/electricity/verify-meter-number` service on path `/guest/electricity/verify-meter-number`
const { VerifyMeterNumber } = require("./verify-meter-number.class");
const hooks = require("./verify-meter-number.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/guest/electricity/verify-meter-number",
    new VerifyMeterNumber(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("guest/electricity/verify-meter-number");

  service.hooks(hooks);
};
