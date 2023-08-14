const app = require('../../../src/app');

describe('\'transactions/Recent\' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions/recent');
    expect(service).toBeTruthy();
  });
});
