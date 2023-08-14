// Initializes the `forgotPassword/reset-user-password` service on path `/forgotPassword/reset-user-password`
const { ResetUserPassword } = require('./reset-user-password.class');
const hooks = require('./reset-user-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/forgotPassword/reset-user-password', new ResetUserPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('forgotPassword/reset-user-password');

  service.hooks(hooks);
};
