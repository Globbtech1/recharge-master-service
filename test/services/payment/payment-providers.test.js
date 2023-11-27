const app = require('../../../src/app');

describe('\'payment/paymentProviders\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment/payment-providers');
    expect(service).toBeTruthy();
  });
});
