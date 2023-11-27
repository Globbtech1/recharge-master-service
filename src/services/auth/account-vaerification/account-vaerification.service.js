// Initializes the `auth/accountVaerification` service on path `/auth/account-vaerification`
const { AccountVaerification } = require('./account-vaerification.class');
const hooks = require('./account-vaerification.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auth/account-vaerification', new AccountVaerification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auth/account-vaerification');

  service.hooks(hooks);
};
