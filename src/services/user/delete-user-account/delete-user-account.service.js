// Initializes the `user/deleteUserAccount` service on path `/user/delete-user-account`
const { DeleteUserAccount } = require('./delete-user-account.class');
const hooks = require('./delete-user-account.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/delete-user-account', new DeleteUserAccount(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/delete-user-account');

  service.hooks(hooks);
};
