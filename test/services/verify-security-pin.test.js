const app = require('../../src/app');

describe('\'verifySecurityPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('verify-security-pin');
    expect(service).toBeTruthy();
  });
});
