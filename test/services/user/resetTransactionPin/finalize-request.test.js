const app = require('../../../../src/app');

describe('\'user/resetTransactionPin/finalizeRequest\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/resetTransactionPin/finalize-request');
    expect(service).toBeTruthy();
  });
});
