// Initializes the `schedulePayment/scheduleBillsPayment` service on path `/schedulePayment/schedule-bills-payment`
const { ScheduleBillsPayment } = require('./schedule-bills-payment.class');
const createModel = require('../../../models/schedule-bills-payment.model');
const hooks = require('./schedule-bills-payment.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/schedulePayment/schedule-bills-payment', new ScheduleBillsPayment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('schedulePayment/schedule-bills-payment');

  service.hooks(hooks);
};
