// Initializes the `airtime/buyAirtime` service on path `/airtime/buy-airtime`
const { BuyAirtime } = require('./buy-airtime.class');
const hooks = require('./buy-airtime.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/airtime/buy-airtime', new BuyAirtime(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('airtime/buy-airtime');

  service.hooks(hooks);
};
