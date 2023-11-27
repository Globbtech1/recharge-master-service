// Initializes the `user/removeProfilePix` service on path `/user/remove-profile-pix`
const { RemoveProfilePix } = require('./remove-profile-pix.class');
const hooks = require('./remove-profile-pix.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/remove-profile-pix', new RemoveProfilePix(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/remove-profile-pix');

  service.hooks(hooks);
};
