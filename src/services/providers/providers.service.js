// Initializes the `providers` service on path `/providers`
const { Providers } = require('./providers.class');
const createModel = require('../../models/providers.model');
const hooks = require('./providers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/providers', new Providers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('providers');

  service.hooks(hooks);
};
