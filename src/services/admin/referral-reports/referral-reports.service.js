// Initializes the `admin/referralReports` service on path `/admin/referral-reports`
const { ReferralReports } = require('./referral-reports.class');
const hooks = require('./referral-reports.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/referral-reports', new ReferralReports(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/referral-reports');

  service.hooks(hooks);
};
