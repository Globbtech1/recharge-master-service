// Initializes the `bills/ProviderProducts` service on path `/bills/provider-products`
const { ProviderProducts } = require('./provider-products.class');
const hooks = require('./provider-products.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/bills/provider-products', new ProviderProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bills/provider-products');

  service.hooks(hooks);
};
