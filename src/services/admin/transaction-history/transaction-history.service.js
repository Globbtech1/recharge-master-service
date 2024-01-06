// Initializes the `admin/transactionHistory ` service on path `/admin/transaction-history`
const { TransactionHistory } = require('./transaction-history.class');
const hooks = require('./transaction-history.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/transaction-history', new TransactionHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/transaction-history');

  service.hooks(hooks);
};
