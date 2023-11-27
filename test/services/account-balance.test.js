const app = require('../../src/app');

describe('\'AccountBalance \' service', () => {
  it('registered the service', () => {
    const service = app.service('account-balance');
    expect(service).toBeTruthy();
  });
});
