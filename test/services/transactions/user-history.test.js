const app = require('../../../src/app');

describe('\'transactions/userHistory \' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions/user-history');
    expect(service).toBeTruthy();
  });
});
