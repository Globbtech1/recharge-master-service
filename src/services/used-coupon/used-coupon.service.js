// Initializes the `usedCoupon` service on path `/used-coupon`
const { UsedCoupon } = require('./used-coupon.class');
const createModel = require('../../models/used-coupon.model');
const hooks = require('./used-coupon.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/used-coupon', new UsedCoupon(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('used-coupon');

  service.hooks(hooks);
};
