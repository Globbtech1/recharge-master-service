const app = require('../../../src/app');

describe('\'admin/coupon-management\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/coupon-management');
    expect(service).toBeTruthy();
  });
});
