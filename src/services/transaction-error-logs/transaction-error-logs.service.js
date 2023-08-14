// Initializes the `transactionErrorLogs` service on path `/transaction-error-logs`
const { TransactionErrorLogs } = require('./transaction-error-logs.class');
const createModel = require('../../models/transaction-error-logs.model');
const hooks = require('./transaction-error-logs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/transaction-error-logs', new TransactionErrorLogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transaction-error-logs');

  service.hooks(hooks);
};
