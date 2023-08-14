// Initializes the `electricity/providers` service on path `/electricity/providers`
const { Providers } = require('./providers.class');
const hooks = require('./providers.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/electricity/providers', new Providers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('electricity/providers');

  service.hooks(hooks);
};
