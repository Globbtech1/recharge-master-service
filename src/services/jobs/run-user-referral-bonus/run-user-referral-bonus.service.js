// Initializes the `jobs/runUserReferralBonus` service on path `/jobs/run-user-referral-bonus`
const { RunUserReferralBonus } = require('./run-user-referral-bonus.class');
const hooks = require('./run-user-referral-bonus.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/jobs/run-user-referral-bonus', new RunUserReferralBonus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('jobs/run-user-referral-bonus');

  service.hooks(hooks);
};
