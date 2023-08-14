const app = require('../../../../src/app');

describe('\'guest/tv/product-type-bundles\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/tv/product-type-bundles');
    expect(service).toBeTruthy();
  });
});
