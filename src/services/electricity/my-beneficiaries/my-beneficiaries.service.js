// Initializes the `electricity/my-beneficiaries` service on path `/electricity/my-beneficiaries`
const { MyBeneficiaries } = require('./my-beneficiaries.class');
const hooks = require('./my-beneficiaries.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/electricity/my-beneficiaries', new MyBeneficiaries(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('electricity/my-beneficiaries');

  service.hooks(hooks);
};
