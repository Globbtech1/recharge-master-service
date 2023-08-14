// Initializes the `transactions/Recent` service on path `/transactions/recent`
const { Recent } = require('./recent.class');
const hooks = require('./recent.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/transactions/recent', new Recent(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transactions/recent');

  service.hooks(hooks);
};
