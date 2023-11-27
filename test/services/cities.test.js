const app = require('../../src/app');

describe('\'cities\' service', () => {
  it('registered the service', () => {
    const service = app.service('cities');
    expect(service).toBeTruthy();
  });
});
