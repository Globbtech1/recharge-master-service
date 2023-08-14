const app = require('../../../src/app');

describe('\'guest/confirm\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/confirm');
    expect(service).toBeTruthy();
  });
});
