const app = require('../../../src/app');

describe('\'auth/verifyUserPhoneNumber\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth/verify-user-phone-number');
    expect(service).toBeTruthy();
  });
});
