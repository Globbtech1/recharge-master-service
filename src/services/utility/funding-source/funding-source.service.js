// Initializes the `utility/fundingSource` service on path `/utility/funding-source`
const { FundingSource } = require('./funding-source.class');
const hooks = require('./funding-source.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/utility/funding-source', new FundingSource(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('utility/funding-source');

  service.hooks(hooks);
};
