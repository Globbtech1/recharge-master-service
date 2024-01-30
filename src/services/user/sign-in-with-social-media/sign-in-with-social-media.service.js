// Initializes the `user/signInWithSocialMedia` service on path `/user/sign-in-with-social-media`
const { SignInWithSocialMedia } = require('./sign-in-with-social-media.class');
const hooks = require('./sign-in-with-social-media.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/sign-in-with-social-media', new SignInWithSocialMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/sign-in-with-social-media');

  service.hooks(hooks);
};
