// Initializes the `admin/walletTransferHistory` service on path `/admin/wallet-transfer-history`
const { WalletTransferHistory } = require('./wallet-transfer-history.class');
const hooks = require('./wallet-transfer-history.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/wallet-transfer-history', new WalletTransferHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/wallet-transfer-history');

  service.hooks(hooks);
};
