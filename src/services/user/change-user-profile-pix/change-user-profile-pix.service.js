// Initializes the `user/changeUserProfilePix` service on path `/user/change-user-profile-pix`
const { ChangeUserProfilePix } = require('./change-user-profile-pix.class');
const hooks = require('./change-user-profile-pix.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/change-user-profile-pix', new ChangeUserProfilePix(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/change-user-profile-pix');

  service.hooks(hooks);
};
