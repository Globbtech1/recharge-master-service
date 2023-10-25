// Initializes the `user/redemCoupon` service on path `/user/redem-coupon`
const { RedemCoupon } = require('./redem-coupon.class');
const hooks = require('./redem-coupon.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/redem-coupon', new RedemCoupon(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/redem-coupon');

  service.hooks(hooks);
};
