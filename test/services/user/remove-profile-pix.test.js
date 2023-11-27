const app = require('../../../src/app');

describe('\'user/removeProfilePix\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/remove-profile-pix');
    expect(service).toBeTruthy();
  });
});
