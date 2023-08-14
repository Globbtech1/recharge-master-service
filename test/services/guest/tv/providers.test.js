const app = require('../../../../src/app');

describe('\'guest/tv/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/tv/providers');
    expect(service).toBeTruthy();
  });
});
