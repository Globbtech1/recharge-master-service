const app = require('../../../src/app');

describe('\'admin/fundingHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/funding-history');
    expect(service).toBeTruthy();
  });
});
