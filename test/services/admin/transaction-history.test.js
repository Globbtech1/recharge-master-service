const app = require('../../../src/app');

describe('\'admin/transactionHistory \' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/transaction-history');
    expect(service).toBeTruthy();
  });
});
