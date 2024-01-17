// Initializes the `admin/dashboardData` service on path `/admin/dashboard-data`
const { DashboardData } = require('./dashboard-data.class');
const hooks = require('./dashboard-data.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/dashboard-data', new DashboardData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/dashboard-data');

  service.hooks(hooks);
};
