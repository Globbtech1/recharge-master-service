const app = require('../../../src/app');

describe('\'bills/ProviderProducts\' service', () => {
  it('registered the service', () => {
    const service = app.service('bills/provider-products');
    expect(service).toBeTruthy();
  });
});
