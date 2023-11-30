const app = require('../../../src/app');

describe('\'user/myBeneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/my-beneficiaries');
    expect(service).toBeTruthy();
  });
});
