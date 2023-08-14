// Initializes the `guest/tv/provider-product-types` service on path `/guest/tv/provider-product-types`
const { ProviderProductTypes } = require('./provider-product-types.class');
const hooks = require('./provider-product-types.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/tv/provider-product-types', new ProviderProductTypes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/tv/provider-product-types');

  service.hooks(hooks);
};
