const app = require('../../src/app');

describe('\'newsletter\' service', () => {
  it('registered the service', () => {
    const service = app.service('newsletter');
    expect(service).toBeTruthy();
  });
});
