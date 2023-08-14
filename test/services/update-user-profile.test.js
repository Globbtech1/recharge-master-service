const app = require('../../src/app');

describe('\'updateUserProfile\' service', () => {
  it('registered the service', () => {
    const service = app.service('update-user-profile');
    expect(service).toBeTruthy();
  });
});
