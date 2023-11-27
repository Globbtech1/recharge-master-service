// Initializes the `integrations/EmailService` service on path `/integrations/email-service`
const { EmailService } = require('./email-service.class');
const hooks = require('./email-service.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/integrations/email-service', new EmailService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('integrations/email-service');

  service.hooks(hooks);
};
