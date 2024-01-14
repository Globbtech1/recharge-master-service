// Initializes the `user/resetTransactionPin/finalizeRequest` service on path `/user/resetTransactionPin/finalize-request`
const { FinalizeRequest } = require('./finalize-request.class');
const hooks = require('./finalize-request.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user/resetTransactionPin/finalize-request', new FinalizeRequest(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user/resetTransactionPin/finalize-request');

  service.hooks(hooks);
};
