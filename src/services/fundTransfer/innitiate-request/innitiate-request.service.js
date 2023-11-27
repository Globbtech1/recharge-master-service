// Initializes the `fundTransfer/innitiateRequest` service on path `/fundTransfer/innitiate-request`
const { InnitiateRequest } = require('./innitiate-request.class');
const hooks = require('./innitiate-request.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fundTransfer/innitiate-request', new InnitiateRequest(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fundTransfer/innitiate-request');

  service.hooks(hooks);
};
