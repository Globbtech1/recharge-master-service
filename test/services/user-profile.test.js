const app = require('../../src/app');

describe('\'userProfile\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-profile');
    expect(service).toBeTruthy();
  });
});
