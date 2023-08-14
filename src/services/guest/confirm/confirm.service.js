// Initializes the `guest/confirm` service on path `/guest/confirm`
const { Confirm } = require('./confirm.class');
const hooks = require('./confirm.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/confirm', new Confirm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/confirm');

  service.hooks(hooks);
};
