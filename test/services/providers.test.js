const app = require('../../src/app');

describe('\'providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('providers');
    expect(service).toBeTruthy();
  });
});
