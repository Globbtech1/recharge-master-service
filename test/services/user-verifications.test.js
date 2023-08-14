const app = require('../../src/app');

describe('\'userVerifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-verifications');
    expect(service).toBeTruthy();
  });
});
