const app = require('../../src/app');

describe('\'changeSecurityPin\' service', () => {
  it('registered the service', () => {
    const service = app.service('change-security-pin');
    expect(service).toBeTruthy();
  });
});
