// Initializes the `data/buyDataBundle` service on path `/data/buy-data-bundle`
const { BuyDataBundle } = require('./buy-data-bundle.class');
const hooks = require('./buy-data-bundle.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/buy-data-bundle', new BuyDataBundle(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/buy-data-bundle');

  service.hooks(hooks);
};
