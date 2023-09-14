const app = require('../../../src/app');

describe('\'email-verification/email-verification\' service', () => {
  it('registered the service', () => {
    const service = app.service('email-verification/email-verification');
    expect(service).toBeTruthy();
  });
});