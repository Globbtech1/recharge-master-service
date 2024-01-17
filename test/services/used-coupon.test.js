const app = require('../../src/app');

describe('\'usedCoupon\' service', () => {
  it('registered the service', () => {
    const service = app.service('used-coupon');
    expect(service).toBeTruthy();
  });
});
