// Initializes the `updateUserProfile` service on path `/update-user-profile`
const { UpdateUserProfile } = require('./update-user-profile.class');
const hooks = require('./update-user-profile.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/update-user-profile', new UpdateUserProfile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('update-user-profile');

  service.hooks(hooks);
};
