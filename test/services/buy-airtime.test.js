const app = require('../../src/app');

describe('\'buy-airtime\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/buy-airtime');
    expect(service).toBeTruthy();
  });
});
