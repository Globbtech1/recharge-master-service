const app = require('../../../src/app');

describe('\'tv-subscription/provider-product-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/provider-product-types');
    expect(service).toBeTruthy();
  });
});
