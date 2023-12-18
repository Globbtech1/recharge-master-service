const app = require('../../src/app');

describe('\'user-notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-notification');
    expect(service).toBeTruthy();
  });
});
