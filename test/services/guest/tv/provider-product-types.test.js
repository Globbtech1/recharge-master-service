const app = require('../../../../src/app');

describe('\'guest/tv/provider-product-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/tv/provider-product-types');
    expect(service).toBeTruthy();
  });
});
