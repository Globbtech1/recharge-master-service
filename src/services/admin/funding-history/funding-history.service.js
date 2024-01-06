// Initializes the `admin/fundingHistory` service on path `/admin/funding-history`
const { FundingHistory } = require('./funding-history.class');
const hooks = require('./funding-history.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/funding-history', new FundingHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/funding-history');

  service.hooks(hooks);
};
