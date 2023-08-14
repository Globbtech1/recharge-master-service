const app = require('../../src/app');

describe('\'setSecurityPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('set-security-pin');
    expect(service).toBeTruthy();
  });
});
