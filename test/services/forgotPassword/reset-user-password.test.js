const app = require('../../../src/app');

describe('\'forgotPassword/reset-user-password\' service', () => {
  it('registered the service', () => {
    const service = app.service('forgotPassword/reset-user-password');
    expect(service).toBeTruthy();
  });
});
