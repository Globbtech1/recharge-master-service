const app = require('../../src/app');

describe('\'supportedBanks\' service', () => {
  it('registered the service', () => {
    const service = app.service('supported-banks');
    expect(service).toBeTruthy();
  });
});
