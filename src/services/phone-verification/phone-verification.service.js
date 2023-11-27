// Initializes the `EmailVerification ` service on path `/email-verification`
const { PhoneVerification } = require('./phone-verification.class');
const verificationModel = require('../../models/verification.model');
const hooks = require('./phone-verification.hooks');

module.exports = function (app) {
  const options = {
    Model: verificationModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/phone-verification', new PhoneVerification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('phone-verification');

  service.hooks(hooks);
};
