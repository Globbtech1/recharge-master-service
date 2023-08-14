// Initializes the `paymentList` service on path `/payment-list`
const { PaymentList } = require("./payment-list.class");
const createModel = require("../../models/payment-list.model");
const hooks = require("./payment-list.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    provider: "internal",
  };

  // Initialize our service with any options it requires
  app.use("/payment-list", new PaymentList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("payment-list");

  service.hooks(hooks);
};
