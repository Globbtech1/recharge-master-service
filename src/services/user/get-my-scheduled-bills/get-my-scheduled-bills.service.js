// Initializes the `user/getMyScheduledBills` service on path `/user/get-my-scheduled-bills`
const { GetMyScheduledBills } = require('./get-my-scheduled-bills.class');
const hooks = require('./get-my-scheduled-bills.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/get-my-scheduled-bills', new GetMyScheduledBills(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/get-my-scheduled-bills');

  service.hooks(hooks);
};
