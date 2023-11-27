const app = require('../../../src/app');

describe('\'admin/couponUserCategory\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/coupon-user-category');
    expect(service).toBeTruthy();
  });
});
