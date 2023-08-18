// Initializes the `user/createTransactionPin` service on path `/user/create-transaction-pin`
const { CreateTransactionPin } = require("./create-transaction-pin.class");
const hooks = require("./create-transaction-pin.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/user/create-transaction-pin",
    new CreateTransactionPin(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("user/create-transaction-pin");

  service.hooks(hooks);
};
