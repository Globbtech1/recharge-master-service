// Initializes the `admin/couponUserCategory` service on path `/admin/coupon-user-category`
const { CouponUserCategory } = require('./coupon-user-category.class');
const hooks = require('./coupon-user-category.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/coupon-user-category', new CouponUserCategory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/coupon-user-category');

  service.hooks(hooks);
};
