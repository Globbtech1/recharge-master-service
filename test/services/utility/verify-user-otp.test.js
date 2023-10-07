const app = require('../../../src/app');

describe('\'utility/verifyUserOtp\' service', () => {
  it('registered the service', () => {
    const service = app.service('utility/verify-user-otp');
    expect(service).toBeTruthy();
  });
});
