const app = require('../../../src/app');

describe('\'utility/verifyUserPassword\' service', () => {
  it('registered the service', () => {
    const service = app.service('utility/verify-user-password');
    expect(service).toBeTruthy();
  });
});
