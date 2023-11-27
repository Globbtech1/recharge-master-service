// Initializes the `auth/verifyUserPhoneNumber` service on path `/auth/verify-user-phone-number`
const { VerifyUserPhoneNumber } = require('./verify-user-phone-number.class');
const hooks = require('./verify-user-phone-number.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auth/verify-user-phone-number', new VerifyUserPhoneNumber(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auth/verify-user-phone-number');

  service.hooks(hooks);
};
