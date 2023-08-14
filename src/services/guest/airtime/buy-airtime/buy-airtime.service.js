// Initializes the `guest/airtime/buy-airtime` service on path `/guest/airtime/buy-airtime`
const { BuyAirtime } = require('./buy-airtime.class');
const hooks = require('./buy-airtime.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/airtime/buy-airtime', new BuyAirtime(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/airtime/buy-airtime');

  service.hooks(hooks);
};
