const app = require('../../src/app');

describe('\'subBlogcat\' service', () => {
  it('registered the service', () => {
    const service = app.service('sub-blogcat');
    expect(service).toBeTruthy();
  });
});
