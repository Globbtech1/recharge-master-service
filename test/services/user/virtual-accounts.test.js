const app = require('../../../src/app');

describe('\'user/virtualAccounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/virtual-accounts');
    expect(service).toBeTruthy();
  });
});
