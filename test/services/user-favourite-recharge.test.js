const app = require('../../src/app');

describe('\'userFavouriteRecharge \' service', () => {
  it('registered the service', () => {
    const service = app.service('user-favourite-recharge');
    expect(service).toBeTruthy();
  });
});
