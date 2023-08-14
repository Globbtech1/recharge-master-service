const app = require('../../../../src/app');

describe('\'guest/electricity/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/electricity/providers');
    expect(service).toBeTruthy();
  });
});
