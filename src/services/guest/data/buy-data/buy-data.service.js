// Initializes the `guest/data/buy-data` service on path `/guest/data/buy-data`
const { BuyData } = require('./buy-data.class');
const hooks = require('./buy-data.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/guest/data/buy-data', new BuyData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('guest/data/buy-data');

  service.hooks(hooks);
};
