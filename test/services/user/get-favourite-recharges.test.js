const app = require('../../../src/app');

describe('\'user/getFavouriteRecharges\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/get-favourite-recharges');
    expect(service).toBeTruthy();
  });
});
