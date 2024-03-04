// Initializes the `admin/setReferralsBonus` service on path `/admin/set-referrals-bonus`
const { SetReferralsBonus } = require('./set-referrals-bonus.class');
const createModel = require('../../../models/set-referrals-bonus.model');
const hooks = require('./set-referrals-bonus.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/set-referrals-bonus', new SetReferralsBonus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/set-referrals-bonus');

  service.hooks(hooks);
};
