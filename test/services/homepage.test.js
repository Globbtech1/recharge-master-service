const app = require('../../src/app');

describe('\'homepage\' service', () => {
  it('registered the service', () => {
    const service = app.service('homepage');
    expect(service).toBeTruthy();
  });
});
