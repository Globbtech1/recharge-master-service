// Initializes the `monnify/paymentCallback` service on path `/monnify/payment-callback`
const { PaymentCallback } = require('./payment-callback.class');
const hooks = require('./payment-callback.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/monnify/payment-callback', new PaymentCallback(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('monnify/payment-callback');

  service.hooks(hooks);
};
