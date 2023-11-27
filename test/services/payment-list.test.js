const app = require('../../src/app');

describe('\'paymentList\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-list');
    expect(service).toBeTruthy();
  });
});
