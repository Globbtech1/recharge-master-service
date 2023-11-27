const app = require('../../../src/app');

describe('\'transactions/overview\' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions/overview');
    expect(service).toBeTruthy();
  });
});
