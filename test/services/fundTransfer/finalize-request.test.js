const app = require('../../../src/app');

describe('\'fundTransfer/finalizeRequest\' service', () => {
  it('registered the service', () => {
    const service = app.service('fundTransfer/finalize-request');
    expect(service).toBeTruthy();
  });
});
