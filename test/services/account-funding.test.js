const app = require('../../src/app');

describe('\'AccountFunding\' service', () => {
  it('registered the service', () => {
    const service = app.service('account-funding');
    expect(service).toBeTruthy();
  });
});
