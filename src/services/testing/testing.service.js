// Initializes the `testing` service on path `/testing`
const { Testing } = require("./testing.class");
const hooks = require("./testing.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/testing", new Testing(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("testing");

  service.hooks(hooks);
};
