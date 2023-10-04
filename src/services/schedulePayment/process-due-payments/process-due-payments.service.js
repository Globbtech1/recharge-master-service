// Initializes the `schedulePayment/processDuePayments` service on path `/schedulePayment/process-due-payments`
const { ProcessDuePayments } = require('./process-due-payments.class');
const hooks = require('./process-due-payments.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/schedulePayment/process-due-payments', new ProcessDuePayments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('schedulePayment/process-due-payments');

  service.hooks(hooks);
};
