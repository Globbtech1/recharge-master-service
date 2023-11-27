const app = require('../../../src/app');

describe('\'fundTransfer/innitiateRequest\' service', () => {
  it('registered the service', () => {
    const service = app.service('fundTransfer/innitiate-request');
    expect(service).toBeTruthy();
  });
});
