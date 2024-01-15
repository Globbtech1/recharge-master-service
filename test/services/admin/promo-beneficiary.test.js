const app = require('../../../src/app');

describe('\'admin/promoBeneficiary\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/promo-beneficiary');
    expect(service).toBeTruthy();
  });
});
