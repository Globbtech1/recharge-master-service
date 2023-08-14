const app = require('../../src/app');

describe('\'blogcat\' service', () => {
  it('registered the service', () => {
    const service = app.service('blogcat');
    expect(service).toBeTruthy();
  });
});
