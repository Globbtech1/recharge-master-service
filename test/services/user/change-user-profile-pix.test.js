const app = require('../../../src/app');

describe('\'user/changeUserProfilePix\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/change-user-profile-pix');
    expect(service).toBeTruthy();
  });
});
