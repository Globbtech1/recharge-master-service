// Initializes the `user/delete-account-request-finalize` service on path `/user/delete-account-request-finalize`
const { DeleteAccountRequestFinalize } = require('./delete-account-request-finalize.class');
const hooks = require('./delete-account-request-finalize.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/delete-account-request-finalize', new DeleteAccountRequestFinalize(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/delete-account-request-finalize');

  service.hooks(hooks);
};
