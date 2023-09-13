// Initializes the `accountFunding/verifyPayment` service on path `/accountFunding/verify-payment`
const { VerifyPayment } = require('./verify-payment.class');
const hooks = require('./verify-payment.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/accountFunding/verify-payment', new VerifyPayment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('accountFunding/verify-payment');

  service.hooks(hooks);
};
