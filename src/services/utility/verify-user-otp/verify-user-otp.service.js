// Initializes the `utility/verifyUserOtp` service on path `/utility/verify-user-otp`
const { VerifyUserOtp } = require('./verify-user-otp.class');
const hooks = require('./verify-user-otp.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/utility/verify-user-otp', new VerifyUserOtp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('utility/verify-user-otp');

  service.hooks(hooks);
};
