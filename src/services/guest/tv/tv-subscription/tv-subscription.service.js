// Initializes the `guest/tv/tv-subscription` service on path `/guest/tv/tv-subscription`
const { TvSubscription } = require('./tv-subscription.class');
const hooks = require('./tv-subscription.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/tv/tv-subscription', new TvSubscription(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/tv/tv-subscription');

  service.hooks(hooks);
};
