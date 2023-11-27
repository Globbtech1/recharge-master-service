const app = require('../../src/app');

describe('\'testing\' service', () => {
  it('registered the service', () => {
    const service = app.service('testing');
    expect(service).toBeTruthy();
  });
});
