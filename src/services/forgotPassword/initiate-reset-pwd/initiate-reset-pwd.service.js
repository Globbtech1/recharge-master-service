// Initializes the `forgotPassword/initiate-reset-pwd` service on path `/forgotPassword/initiate-reset-pwd`
const { InitiateResetPwd } = require('./initiate-reset-pwd.class');
const createModel = require('../../../models/initiate-reset-pwd.model');
const hooks = require('./initiate-reset-pwd.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/forgotPassword/initiate-reset-pwd', new InitiateResetPwd(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('forgotPassword/initiate-reset-pwd');

  service.hooks(hooks);
};
