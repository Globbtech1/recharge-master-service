// Initializes the `admin/specialOps` service on path `/admin/special-ops`
const { SpecialOps } = require('./special-ops.class');
const hooks = require('./special-ops.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/special-ops', new SpecialOps(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/special-ops');

  service.hooks(hooks);
};
