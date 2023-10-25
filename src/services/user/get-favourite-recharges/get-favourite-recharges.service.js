// Initializes the `user/getFavouriteRecharges` service on path `/user/get-favourite-recharges`
const { GetFavouriteRecharges } = require('./get-favourite-recharges.class');
const hooks = require('./get-favourite-recharges.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/get-favourite-recharges', new GetFavouriteRecharges(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/get-favourite-recharges');

  service.hooks(hooks);
};
