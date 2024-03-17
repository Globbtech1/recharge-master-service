// Initializes the `admin/mobileBanners` service on path `/admin/mobile-banners`
const { MobileBanners } = require('./mobile-banners.class');
const createModel = require('../../../models/mobile-banners.model');
const hooks = require('./mobile-banners.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/mobile-banners', new MobileBanners(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/mobile-banners');

  service.hooks(hooks);
};
