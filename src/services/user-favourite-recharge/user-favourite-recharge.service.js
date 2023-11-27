// Initializes the `userFavouriteRecharge ` service on path `/user-favourite-recharge`
const { UserFavouriteRecharge } = require('./user-favourite-recharge.class');
const createModel = require('../../models/user-favourite-recharge.model');
const hooks = require('./user-favourite-recharge.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-favourite-recharge', new UserFavouriteRecharge(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-favourite-recharge');

  service.hooks(hooks);
};
