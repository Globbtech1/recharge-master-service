// Initializes the `data/providers` service on path `/data/providers`
const { Providers } = require('./providers.class');
const hooks = require('./providers.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/providers', new Providers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/providers');

  service.hooks(hooks);
};
