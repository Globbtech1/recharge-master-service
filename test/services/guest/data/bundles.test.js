const app = require('../../../../src/app');

describe('\'guest/data/bundles\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/data/bundles');
    expect(service).toBeTruthy();
  });
});
