// Initializes the `user/dataValidation` service on path `/user/data-validation`
const { DataValidation } = require('./data-validation.class');
const hooks = require('./data-validation.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/data-validation', new DataValidation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/data-validation');

  service.hooks(hooks);
};
