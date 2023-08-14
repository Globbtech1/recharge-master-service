const app = require('../../../src/app');

describe('\'data/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/providers');
    expect(service).toBeTruthy();
  });
});
