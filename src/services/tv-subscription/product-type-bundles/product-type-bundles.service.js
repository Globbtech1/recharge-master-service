// Initializes the `tv-subscription/product-type-bundles` service on path `/tv-subscription/product-type-bundles`
const { ProductTypeBundles } = require('./product-type-bundles.class');
const hooks = require('./product-type-bundles.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tv-subscription/product-type-bundles', new ProductTypeBundles(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tv-subscription/product-type-bundles');

  service.hooks(hooks);
};
