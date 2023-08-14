const app = require('../../src/app');

describe('\'articleBanner\' service', () => {
  it('registered the service', () => {
    const service = app.service('article-banner');
    expect(service).toBeTruthy();
  });
});
