const app = require('../../../src/app');

describe('\'airtime/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('airtime/providers');
    expect(service).toBeTruthy();
  });
});
