// Initializes the `AccountBalance ` service on path `/account-balance`
const { AccountBalance } = require('./account-balance.class');
const createModel = require('../../models/account-balance.model');
const hooks = require('./account-balance.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/account-balance', new AccountBalance(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('account-balance');

  service.hooks(hooks);
};
