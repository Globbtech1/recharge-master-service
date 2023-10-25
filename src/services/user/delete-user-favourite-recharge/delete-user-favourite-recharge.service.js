// Initializes the `user/delete-user-favourite-recharge` service on path `/user/delete-user-favourite-recharge`
const {
  DeleteUserFavouriteRecharge,
} = require("./delete-user-favourite-recharge.class");
const hooks = require("./delete-user-favourite-recharge.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/user/delete-user-favourite-recharge",
    new DeleteUserFavouriteRecharge(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("user/delete-user-favourite-recharge");

  service.hooks(hooks);
};
