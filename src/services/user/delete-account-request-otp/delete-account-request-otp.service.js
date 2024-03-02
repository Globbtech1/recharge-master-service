// Initializes the `user/delete-account-request-otp` service on path `/user/delete-account-request-otp`
const { DeleteAccountRequestOtp } = require('./delete-account-request-otp.class');
const hooks = require('./delete-account-request-otp.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/delete-account-request-otp', new DeleteAccountRequestOtp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/delete-account-request-otp');

  service.hooks(hooks);
};
