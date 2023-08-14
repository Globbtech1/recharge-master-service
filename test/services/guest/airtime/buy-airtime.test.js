const app = require('../../../../src/app');

describe('\'guest/airtime/buy-airtime\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/airtime/buy-airtime');
    expect(service).toBeTruthy();
  });
});
