// Initializes the `admin/coupon-management` service on path `/admin/coupon-management`
const { CouponManagement } = require('./coupon-management.class');
const createModel = require('../../../models/coupon-management.model');
const hooks = require('./coupon-management.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/coupon-management', new CouponManagement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/coupon-management');

  service.hooks(hooks);
};
