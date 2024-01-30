const app = require('../../../src/app');

describe('\'user/signupwithSocialMedia\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/signupwith-social-media');
    expect(service).toBeTruthy();
  });
});
