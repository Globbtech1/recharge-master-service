const app = require('../../../src/app');

describe('\'forgotPassword/initiate-reset-pwd\' service', () => {
  it('registered the service', () => {
    const service = app.service('forgotPassword/initiate-reset-pwd');
    expect(service).toBeTruthy();
  });
});
