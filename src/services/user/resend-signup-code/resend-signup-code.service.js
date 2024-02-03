// Initializes the `user/resendSignupCode` service on path `/user/resend-signup-code`
const { ResendSignupCode } = require('./resend-signup-code.class');
const hooks = require('./resend-signup-code.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/resend-signup-code', new ResendSignupCode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/resend-signup-code');

  service.hooks(hooks);
};
