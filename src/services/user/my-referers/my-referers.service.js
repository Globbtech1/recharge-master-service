// Initializes the `user/myReferers` service on path `/user/my-referers`
const { MyReferers } = require('./my-referers.class');
const hooks = require('./my-referers.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/my-referers', new MyReferers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/my-referers');

  service.hooks(hooks);
};
