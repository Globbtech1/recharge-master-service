const app = require('../../../src/app');

describe('\'accountFunding/verifyPayment\' service', () => {
  it('registered the service', () => {
    const service = app.service('accountFunding/verify-payment');
    expect(service).toBeTruthy();
  });
});
