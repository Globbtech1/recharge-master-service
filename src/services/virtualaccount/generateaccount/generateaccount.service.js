// Initializes the `virtualaccount/generateaccount` service on path `/virtualaccount/generateaccount`
const { Generateaccount } = require('./generateaccount.class');
const createModel = require('../../../models/generateaccount.model');
const hooks = require('./generateaccount.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/virtualaccount/generateaccount', new Generateaccount(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('virtualaccount/generateaccount');

  service.hooks(hooks);
};
