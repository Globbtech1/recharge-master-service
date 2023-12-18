// Initializes the `userNotification` service on path `/user-notification`
const { UserNotification } = require("./user-notification.class");
const hooks = require("./user-notification.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-notification", new UserNotification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-notification");

  service.hooks(hooks);
};
