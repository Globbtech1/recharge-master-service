// Initializes the `supportedBanks` service on path `/supported-banks`
const { SupportedBanks } = require('./supported-banks.class');
const createModel = require('../../models/supported-banks.model');
const hooks = require('./supported-banks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/supported-banks', new SupportedBanks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('supported-banks');

  service.hooks(hooks);
};
