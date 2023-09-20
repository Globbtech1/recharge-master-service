// Initializes the `auth/verifyUserEmail` service on path `/auth/verify-user-email`
const { VerifyUserEmail } = require('./verify-user-email.class');
const hooks = require('./verify-user-email.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auth/verify-user-email', new VerifyUserEmail(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auth/verify-user-email');

  service.hooks(hooks);
};
