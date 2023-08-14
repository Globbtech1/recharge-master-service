const app = require('../../../src/app');

describe('\'payment/paylist\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment/paylist');
    expect(service).toBeTruthy();
  });
});
