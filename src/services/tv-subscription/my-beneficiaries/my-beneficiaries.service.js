// Initializes the `tv-subscription/my-beneficiaries` service on path `/tv-subscription/my-beneficiaries`
const { MyBeneficiaries } = require('./my-beneficiaries.class');
const hooks = require('./my-beneficiaries.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tv-subscription/my-beneficiaries', new MyBeneficiaries(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tv-subscription/my-beneficiaries');

  service.hooks(hooks);
};
