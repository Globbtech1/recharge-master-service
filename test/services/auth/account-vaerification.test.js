const app = require('../../../src/app');

describe('\'auth/accountVaerification\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth/account-vaerification');
    expect(service).toBeTruthy();
  });
});
