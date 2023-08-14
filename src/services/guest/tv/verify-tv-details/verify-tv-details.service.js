// Initializes the `guest/tv/verify-tv-details` service on path `/guest/tv/verify-tv-details`
const { VerifyTvDetails } = require('./verify-tv-details.class');
const hooks = require('./verify-tv-details.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/tv/verify-tv-details', new VerifyTvDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/tv/verify-tv-details');

  service.hooks(hooks);
};
