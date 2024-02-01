// Initializes the `test/sampleSMS` service on path `/test/sample-sms`
const { SampleSms } = require('./sample-sms.class');
const hooks = require('./sample-sms.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test/sample-sms', new SampleSms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test/sample-sms');

  service.hooks(hooks);
};
