// Initializes the `admin/adminManagement` service on path `/admin/admin-management`
const { AdminManagement } = require('./admin-management.class');
const hooks = require('./admin-management.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/admin-management', new AdminManagement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/admin-management');

  service.hooks(hooks);
};
