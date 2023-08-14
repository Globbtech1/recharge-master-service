// Initializes the `guest/guest-purchase` service on path `/guest/guest-purchase`
const { GuestPurchase } = require('./guest-purchase.class');
const createModel = require('../../../models/guest-purchase.model');
const hooks = require('./guest-purchase.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/guest-purchase', new GuestPurchase(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/guest-purchase');

  service.hooks(hooks);
};
