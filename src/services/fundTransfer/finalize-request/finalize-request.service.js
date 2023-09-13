// Initializes the `fundTransfer/finalizeRequest` service on path `/fundTransfer/finalize-request`
const { FinalizeRequest } = require('./finalize-request.class');
const hooks = require('./finalize-request.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fundTransfer/finalize-request', new FinalizeRequest(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fundTransfer/finalize-request');

  service.hooks(hooks);
};
