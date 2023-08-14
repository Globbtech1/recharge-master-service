// Initializes the `payment/paylist` service on path `/payment/paylist`
const { Paylist } = require('./paylist.class');
const hooks = require('./paylist.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment/paylist', new Paylist(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment/paylist');

  service.hooks(hooks);
};
