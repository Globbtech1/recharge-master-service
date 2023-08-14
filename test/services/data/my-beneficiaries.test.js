const app = require('../../../src/app');

describe('\'data/myBeneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/my-beneficiaries');
    expect(service).toBeTruthy();
  });
});
