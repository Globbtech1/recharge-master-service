const app = require('../../../src/app');

describe('\'users/paymentlist\' service', () => {
  it('registered the service', () => {
    const service = app.service('users/paymentlist');
    expect(service).toBeTruthy();
  });
});
