const app = require('../../../src/app');

describe('\'user/deleteUserAccount\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/delete-user-account');
    expect(service).toBeTruthy();
  });
});
