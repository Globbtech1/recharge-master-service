const app = require('../../src/app');

describe('\'customet\' service', () => {
  it('registered the service', () => {
    const service = app.service('customet');
    expect(service).toBeTruthy();
  });
});
