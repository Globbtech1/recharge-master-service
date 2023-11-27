// Initializes the `user/eligibleCoupons` service on path `/user/eligible-coupons`
const { EligibleCoupons } = require('./eligible-coupons.class');
const hooks = require('./eligible-coupons.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/eligible-coupons', new EligibleCoupons(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/eligible-coupons');

  service.hooks(hooks);
};
