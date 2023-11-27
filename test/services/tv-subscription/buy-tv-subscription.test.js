const app = require('../../../src/app');

describe('\'tv-subscription/buy-tv-subscription\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/buy-tv-subscription');
    expect(service).toBeTruthy();
  });
});
