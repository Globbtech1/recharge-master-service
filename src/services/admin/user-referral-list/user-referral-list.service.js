// Initializes the `admin/user-referral-list` service on path `/admin/user-referral-list`
const { UserReferralList } = require('./user-referral-list.class');
const hooks = require('./user-referral-list.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/user-referral-list', new UserReferralList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/user-referral-list');

  service.hooks(hooks);
};
