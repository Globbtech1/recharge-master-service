// Initializes the `transactions/overview` service on path `/transactions/overview`
const { Overview } = require('./overview.class');
const hooks = require('./overview.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/transactions/overview', new Overview(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transactions/overview');

  service.hooks(hooks);
};
