const app = require('../../../src/app');

describe('\'user/resendSignupCode\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/resend-signup-code');
    expect(service).toBeTruthy();
  });
});
