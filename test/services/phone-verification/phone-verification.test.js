const app = require('../../../src/app');

describe('\'phone-verification/phone-verification\' service', () => {
  it('registered the service', () => {
    const service = app.service('phone-verification/phone-verification');
    expect(service).toBeTruthy();
  });
});