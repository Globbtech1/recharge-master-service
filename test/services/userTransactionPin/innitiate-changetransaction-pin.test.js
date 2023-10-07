const app = require('../../../src/app');

describe('\'userTransactionPin/innitiateChangetransactionPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('userTransactionPin/innitiate-changetransaction-pin');
    expect(service).toBeTruthy();
  });
});
