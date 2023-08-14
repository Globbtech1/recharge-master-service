// Initializes the `guest/tv/providers` service on path `/guest/tv/providers`
const { Providers } = require('./providers.class');
const hooks = require('./providers.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/tv/providers', new Providers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/tv/providers');

  service.hooks(hooks);
};
