const app = require('../../../src/app');

describe('\'data/bundles\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/bundles');
    expect(service).toBeTruthy();
  });
});
