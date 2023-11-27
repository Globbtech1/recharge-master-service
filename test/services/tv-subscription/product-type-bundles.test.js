const app = require('../../../src/app');

describe('\'tv-subscription/product-type-bundles\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/product-type-bundles');
    expect(service).toBeTruthy();
  });
});
