// Initializes the `verifySecurityPin` service on path `/verify-security-pin`
const { VerifySecurityPin } = require('./verify-security-pin.class');
const hooks = require('./verify-security-pin.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/verify-security-pin', new VerifySecurityPin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('verify-security-pin');

  service.hooks(hooks);
};
