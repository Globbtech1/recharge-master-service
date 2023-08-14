// Initializes the `tv-subscription/provider-product-types` service on path `/tv-subscription/provider-product-types`
const { ProviderProductTypes } = require('./provider-product-types.class');
const hooks = require('./provider-product-types.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tv-subscription/provider-product-types', new ProviderProductTypes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tv-subscription/provider-product-types');

  service.hooks(hooks);
};
