// Initializes the `utility/verifyUserPassword` service on path `/utility/verify-user-password`
const { VerifyUserPassword } = require('./verify-user-password.class');
const hooks = require('./verify-user-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/utility/verify-user-password', new VerifyUserPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('utility/verify-user-password');

  service.hooks(hooks);
};
