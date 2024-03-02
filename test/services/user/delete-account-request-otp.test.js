const app = require('../../../src/app');

describe('\'user/delete-account-request-otp\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/delete-account-request-otp');
    expect(service).toBeTruthy();
  });
});
