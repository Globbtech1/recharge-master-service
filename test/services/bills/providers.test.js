const app = require('../../../src/app');

describe('\'bills/Providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('bills/providers');
    expect(service).toBeTruthy();
  });
});
