// Initializes the `EmailVerification ` service on path `/email-verification`
const { EmailVerification } = require('./email-verification.class');
const verificationModel = require('../../models/verification.model');
const hooks = require('./email-verification.hooks');

module.exports = function (app) {
  const options = {
    Model: verificationModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/email-verification', new EmailVerification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('email-verification');

  service.hooks(hooks);
  };

