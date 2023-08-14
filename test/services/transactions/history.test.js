const app = require('../../../src/app');

describe('\'transactions/history\' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions/history');
    expect(service).toBeTruthy();
  });
});
