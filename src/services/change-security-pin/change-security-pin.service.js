// Initializes the `changeSecurityPin` service on path `/change-security-pin`
const { ChangeSecurityPin } = require('./change-security-pin.class');
const hooks = require('./change-security-pin.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/change-security-pin', new ChangeSecurityPin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('change-security-pin');

  service.hooks(hooks);
};
