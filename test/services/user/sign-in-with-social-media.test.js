const app = require('../../../src/app');

describe('\'user/signInWithSocialMedia\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/sign-in-with-social-media');
    expect(service).toBeTruthy();
  });
});
