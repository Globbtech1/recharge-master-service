// Initializes the `userTransactionPin/changeUserTransactionPin` service on path `/userTransactionPin/change-user-transaction-pin`
const { ChangeUserTransactionPin } = require('./change-user-transaction-pin.class');
const hooks = require('./change-user-transaction-pin.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/userTransactionPin/change-user-transaction-pin', new ChangeUserTransactionPin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('userTransactionPin/change-user-transaction-pin');

  service.hooks(hooks);
};
