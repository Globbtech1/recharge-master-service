// Initializes the `tv-subscription/validate-tv-details` service on path `/tv-subscription/validate-tv-details`
const { ValidateTvDetails } = require('./validate-tv-details.class');
const hooks = require('./validate-tv-details.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tv-subscription/validate-tv-details', new ValidateTvDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tv-subscription/validate-tv-details');

  service.hooks(hooks);
};
