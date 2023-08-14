// Initializes the `forgotPassword/verifyOtp` service on path `/forgotPassword/verify-otp`
const { VerifyOtp } = require('./verify-otp.class');
const hooks = require('./verify-otp.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/forgotPassword/verify-otp', new VerifyOtp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('forgotPassword/verify-otp');

  service.hooks(hooks);
};
