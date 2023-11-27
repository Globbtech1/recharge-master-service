// Initializes the `accountFunding/innitiateFund` service on path `/accountFunding/innitiate-fund`
const { InnitiateFund } = require('./innitiate-fund.class');
const hooks = require('./innitiate-fund.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/accountFunding/innitiate-fund', new InnitiateFund(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('accountFunding/innitiate-fund');

  service.hooks(hooks);
};
