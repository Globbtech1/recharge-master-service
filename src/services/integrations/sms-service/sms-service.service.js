// Initializes the `integrations/SmsService` service on path `/integrations/sms-service`
const { SmsService } = require('./sms-service.class');
const hooks = require('./sms-service.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/integrations/sms-service', new SmsService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('integrations/sms-service');

  service.hooks(hooks);
};
