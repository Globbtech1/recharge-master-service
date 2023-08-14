const app = require('../../src/app');

describe('\'TransactionsHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions-history');
    expect(service).toBeTruthy();
  });
});
