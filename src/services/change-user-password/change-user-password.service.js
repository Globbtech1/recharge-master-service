// Initializes the `changeUserPassword` service on path `/change-user-password`
const { ChangeUserPassword } = require('./change-user-password.class');
const hooks = require('./change-user-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/change-user-password', new ChangeUserPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('change-user-password');

  service.hooks(hooks);
};
