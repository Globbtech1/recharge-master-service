const app = require('../../../src/app');

describe('\'admin/mobileBanners\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/mobile-banners');
    expect(service).toBeTruthy();
  });
});
