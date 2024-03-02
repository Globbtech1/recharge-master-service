const app = require('../../../src/app');

describe('\'user/delete-account-request-finalize\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/delete-account-request-finalize');
    expect(service).toBeTruthy();
  });
});
