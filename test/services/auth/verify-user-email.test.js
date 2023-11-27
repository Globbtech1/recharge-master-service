const app = require('../../../src/app');

describe('\'auth/verifyUserEmail\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth/verify-user-email');
    expect(service).toBeTruthy();
  });
});
