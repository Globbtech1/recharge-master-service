// Initializes the `cashBack/rewardUser` service on path `/cashBack/reward-user`
const { RewardUser } = require('./reward-user.class');
const createModel = require('../../../models/reward-user.model');
const hooks = require('./reward-user.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cashBack/reward-user', new RewardUser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cashBack/reward-user');

  service.hooks(hooks);
};
