const app = require('../../../src/app');

describe('\'airtime/myBeneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('airtime/my-beneficiaries');
    expect(service).toBeTruthy();
  });
});
