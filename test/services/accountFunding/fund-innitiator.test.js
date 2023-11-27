const app = require('../../../src/app');

describe('\'accountFunding/fundInnitiator\' service', () => {
  it('registered the service', () => {
    const service = app.service('accountFunding/fund-innitiator');
    expect(service).toBeTruthy();
  });
});
