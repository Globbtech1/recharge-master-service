const app = require('../../src/app');

describe('\'home\' service', () => {
  it('registered the service', () => {
    const service = app.service('home');
    expect(service).toBeTruthy();
  });
});
