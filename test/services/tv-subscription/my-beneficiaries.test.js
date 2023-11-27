const app = require('../../../src/app');

describe('\'tv-subscription/my-beneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('tv-subscription/my-beneficiaries');
    expect(service).toBeTruthy();
  });
});
