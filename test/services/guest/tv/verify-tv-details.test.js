const app = require('../../../../src/app');

describe('\'guest/tv/verify-tv-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/tv/verify-tv-details');
    expect(service).toBeTruthy();
  });
});
