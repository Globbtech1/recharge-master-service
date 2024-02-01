// Initializes the `test/sampleEmail` service on path `/test/sample-email`
const { SampleEmail } = require('./sample-email.class');
const hooks = require('./sample-email.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test/sample-email', new SampleEmail(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test/sample-email');

  service.hooks(hooks);
};
