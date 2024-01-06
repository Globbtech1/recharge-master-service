const app = require('../../../src/app');

describe('\'admin/walletTransferHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/wallet-transfer-history');
    expect(service).toBeTruthy();
  });
});
