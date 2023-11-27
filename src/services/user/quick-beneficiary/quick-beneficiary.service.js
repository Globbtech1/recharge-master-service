// Initializes the `user/quickBeneficiary` service on path `/user/quick-beneficiary`
const { QuickBeneficiary } = require('./quick-beneficiary.class');
const createModel = require('../../../models/quick-beneficiary.model');
const hooks = require('./quick-beneficiary.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/quick-beneficiary', new QuickBeneficiary(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/quick-beneficiary');

  service.hooks(hooks);
};
