const app = require('../../../../src/app');

describe('\'user/resetTransactionPin/innitiateRequest\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/resetTransactionPin/innitiate-request');
    expect(service).toBeTruthy();
  });
});
