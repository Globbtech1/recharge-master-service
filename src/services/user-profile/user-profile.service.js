// Initializes the `userProfile` service on path `/user-profile`
const { UserProfile } = require('./user-profile.class');
const hooks = require('./user-profile.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-profile', new UserProfile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-profile');

  service.hooks(hooks);
};
