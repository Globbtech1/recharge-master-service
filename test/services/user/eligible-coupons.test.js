const app = require('../../../src/app');

describe('\'user/eligibleCoupons\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/eligible-coupons');
    expect(service).toBeTruthy();
  });
});
