// Initializes the `accountFunding/fundInnitiator` service on path `/accountFunding/fund-innitiator`
const { FundInnitiator } = require('./fund-innitiator.class');
const createModel = require('../../../models/fund-innitiator.model');
const hooks = require('./fund-innitiator.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/accountFunding/fund-innitiator', new FundInnitiator(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('accountFunding/fund-innitiator');

  service.hooks(hooks);
};
