// Initializes the `payment/paymentProviders` service on path `/payment/payment-providers`
const { PaymentProviders } = require('./payment-providers.class');
const createModel = require('../../../models/payment-providers.model');
const hooks = require('./payment-providers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment/payment-providers', new PaymentProviders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment/payment-providers');

  service.hooks(hooks);
};
