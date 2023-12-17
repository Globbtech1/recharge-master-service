// Initializes the `globalservice/allEnums` service on path `/globalservice/all-enums`
const { AllEnums } = require('./all-enums.class');
const hooks = require('./all-enums.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/globalservice/all-enums', new AllEnums(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('globalservice/all-enums');

  service.hooks(hooks);
};
