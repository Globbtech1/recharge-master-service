const app = require('../../../src/app');

describe('\'user/quickBeneficiary\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/quick-beneficiary');
    expect(service).toBeTruthy();
  });
});
