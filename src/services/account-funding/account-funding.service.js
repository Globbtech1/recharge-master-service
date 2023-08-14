// Initializes the `AccountFunding` service on path `/account-funding`
const { AccountFunding } = require('./account-funding.class');
const createModel = require('../../models/account-funding.model');
const hooks = require('./account-funding.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/account-funding', new AccountFunding(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('account-funding');

  service.hooks(hooks);
};
