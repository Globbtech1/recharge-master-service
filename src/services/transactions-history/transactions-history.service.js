// Initializes the `TransactionsHistory` service on path `/transactions-history`
const { TransactionsHistory } = require("./transactions-history.class");
const createModel = require("../../models/transactions-history.model");
const hooks = require("./transactions-history.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/transactions-history", new TransactionsHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("transactions-history");

  service.hooks(hooks);

  // Register the new custom service method
  // const service = app.service("transactions-history");
  // service.hooks(hooks);
  // service.getTotalAmountSpent = async function (userId) {
  //   return await service.getTotalAmountSpent(userId);
  // };
};
