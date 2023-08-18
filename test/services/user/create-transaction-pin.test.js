const app = require('../../../src/app');

describe('\'user/createTransactionPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/create-transaction-pin');
    expect(service).toBeTruthy();
  });
});
