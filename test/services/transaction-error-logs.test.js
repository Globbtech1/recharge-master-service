const app = require('../../src/app');

describe('\'transactionErrorLogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('transaction-error-logs');
    expect(service).toBeTruthy();
  });
});
