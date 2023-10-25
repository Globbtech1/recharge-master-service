const app = require('../../../src/app');

describe('\'user/delete-user-favourite-recharge\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/delete-user-favourite-recharge');
    expect(service).toBeTruthy();
  });
});
