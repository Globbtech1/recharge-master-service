const app = require('../../src/app');

describe('\'changeUserEmail\' service', () => {
  it('registered the service', () => {
    const service = app.service('change-user-email');
    expect(service).toBeTruthy();
  });
});
