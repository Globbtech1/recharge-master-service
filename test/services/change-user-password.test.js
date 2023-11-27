const app = require('../../src/app');

describe('\'changeUserPassword\' service', () => {
  it('registered the service', () => {
    const service = app.service('change-user-password');
    expect(service).toBeTruthy();
  });
});
