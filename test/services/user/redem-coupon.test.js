const app = require('../../../src/app');

describe('\'user/redemCoupon\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/redem-coupon');
    expect(service).toBeTruthy();
  });
});
