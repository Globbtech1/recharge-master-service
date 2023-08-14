// Initializes the `user/virtualAccounts` service on path `/user/virtual-accounts`
const { VirtualAccounts } = require('./virtual-accounts.class');
const hooks = require('./virtual-accounts.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/virtual-accounts', new VirtualAccounts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/virtual-accounts');

  service.hooks(hooks);
};
