// Initializes the `transactions/userHistory ` service on path `/transactions/user-history`
const { UserHistory } = require('./user-history.class');
const hooks = require('./user-history.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/transactions/user-history', new UserHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transactions/user-history');

  service.hooks(hooks);
};
