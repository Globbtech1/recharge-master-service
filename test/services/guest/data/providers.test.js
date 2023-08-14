const app = require('../../../../src/app');

describe('\'guest/data/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/data/providers');
    expect(service).toBeTruthy();
  });
});
