// Initializes the `bills/Providers` service on path `/bills/providers`
const { Providers } = require("./providers.class");
const hooks = require("./providers.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/bills/providers", new Providers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("bills/providers");

  service.hooks(hooks);
};
