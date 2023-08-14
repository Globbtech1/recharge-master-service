const app = require('../../src/app');

describe('\'articleComment\' service', () => {
  it('registered the service', () => {
    const service = app.service('article-comment');
    expect(service).toBeTruthy();
  });
});
