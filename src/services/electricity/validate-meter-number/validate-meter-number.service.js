// Initializes the `electricity/validate-meter-number` service on path `/electricity/validate-meter-number`
const { ValidateMeterNumber } = require("./validate-meter-number.class");
const hooks = require("./validate-meter-number.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/electricity/validate-meter-number",
    new ValidateMeterNumber(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("electricity/validate-meter-number");

  service.hooks(hooks);
};
