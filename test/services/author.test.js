const app = require('../../src/app');

describe('\'author\' service', () => {
  it('registered the service', () => {
    const service = app.service('author');
    expect(service).toBeTruthy();
  });
});
