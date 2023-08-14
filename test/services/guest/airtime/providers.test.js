const app = require('../../../../src/app');

describe('\'guest/airtime/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/airtime/providers');
    expect(service).toBeTruthy();
  });
});
