// Initializes the `data/bundles` service on path `/data/bundles`
const { Bundles } = require('./bundles.class');
const hooks = require('./bundles.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/bundles', new Bundles(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/bundles');

  service.hooks(hooks);
};
