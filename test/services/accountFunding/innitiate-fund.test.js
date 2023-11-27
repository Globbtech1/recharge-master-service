const app = require('../../../src/app');

describe('\'accountFunding/innitiateFund\' service', () => {
  it('registered the service', () => {
    const service = app.service('accountFunding/innitiate-fund');
    expect(service).toBeTruthy();
  });
});
