// Initializes the `admin/fetchUsers` service on path `/admin/fetch-users`
const { FetchUsers } = require("./fetch-users.class");
const hooks = require("./fetch-users.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/admin/fetch-users", new FetchUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("admin/fetch-users");

  service.hooks(hooks);
};
