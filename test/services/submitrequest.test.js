const app = require('../../src/app');

describe('\'submitrequest\' service', () => {
  it('registered the service', () => {
    const service = app.service('submitrequest');
    expect(service).toBeTruthy();
  });
});
