// Initializes the `user/signupwithSocialMedia` service on path `/user/signupwith-social-media`
const { SignupwithSocialMedia } = require('./signupwith-social-media.class');
const hooks = require('./signupwith-social-media.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/signupwith-social-media', new SignupwithSocialMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/signupwith-social-media');

  service.hooks(hooks);
};
