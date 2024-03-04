// Initializes the `userReferralListBonus` service on path `/user-referral-list-bonus`
const { UserReferralListBonus } = require('./user-referral-list-bonus.class');
const createModel = require('../../models/user-referral-list-bonus.model');
const hooks = require('./user-referral-list-bonus.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-referral-list-bonus', new UserReferralListBonus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-referral-list-bonus');

  service.hooks(hooks);
};
