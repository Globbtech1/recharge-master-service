// Initializes the `electricity/buy-electricity` service on path `/electricity/buy-electricity`
const { BuyElectricity } = require('./buy-electricity.class');
const hooks = require('./buy-electricity.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/electricity/buy-electricity', new BuyElectricity(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('electricity/buy-electricity');

  service.hooks(hooks);
};
