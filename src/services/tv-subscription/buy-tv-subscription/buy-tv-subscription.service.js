// Initializes the `tv-subscription/buy-tv-subscription` service on path `/tv-subscription/buy-tv-subscription`
const { BuyTvSubscription } = require('./buy-tv-subscription.class');
const hooks = require('./buy-tv-subscription.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tv-subscription/buy-tv-subscription', new BuyTvSubscription(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tv-subscription/buy-tv-subscription');

  service.hooks(hooks);
};
