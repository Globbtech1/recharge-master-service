const app = require('../../../src/app');

describe('\'forgotPassword/verifyOtp\' service', () => {
  it('registered the service', () => {
    const service = app.service('forgotPassword/verify-otp');
    expect(service).toBeTruthy();
  });
});
