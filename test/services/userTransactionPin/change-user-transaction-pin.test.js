const app = require('../../../src/app');

describe('\'userTransactionPin/changeUserTransactionPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('userTransactionPin/change-user-transaction-pin');
    expect(service).toBeTruthy();
  });
});
