const app = require('../../../../src/app');

describe('\'guest/tv/tv-subscription\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/tv/tv-subscription');
    expect(service).toBeTruthy();
  });
});
