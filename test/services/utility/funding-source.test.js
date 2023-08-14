const app = require('../../../src/app');

describe('\'utility/fundingSource\' service', () => {
  it('registered the service', () => {
    const service = app.service('utility/funding-source');
    expect(service).toBeTruthy();
  });
});
