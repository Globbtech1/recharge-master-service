const app = require('../../../src/app');

describe('\'tv-subscription/validate-tv-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/validate-tv-details');
    expect(service).toBeTruthy();
  });
});
