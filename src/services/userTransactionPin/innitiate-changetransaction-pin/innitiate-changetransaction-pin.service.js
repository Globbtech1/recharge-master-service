// Initializes the `userTransactionPin/innitiateChangetransactionPin` service on path `/userTransactionPin/innitiate-changetransaction-pin`
const { InnitiateChangetransactionPin } = require('./innitiate-changetransaction-pin.class');
const hooks = require('./innitiate-changetransaction-pin.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/userTransactionPin/innitiate-changetransaction-pin', new InnitiateChangetransactionPin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('userTransactionPin/innitiate-changetransaction-pin');

  service.hooks(hooks);
};
