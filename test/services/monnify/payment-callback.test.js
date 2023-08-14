const app = require('../../../src/app');

describe('\'monnify/paymentCallback\' service', () => {
  it('registered the service', () => {
    const service = app.service('monnify/payment-callback');
    expect(service).toBeTruthy();
  });
});
