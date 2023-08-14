const app = require('../../../src/app');

describe('\'tv-subscription/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/providers');
    expect(service).toBeTruthy();
  });
});
