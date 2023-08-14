const app = require('../../../src/app');

describe('\'airtime/buyAirtime\' service', () => {
  it('registered the service', () => {
    const service = app.service('airtime/buy-airtime');
    expect(service).toBeTruthy();
  });
});
