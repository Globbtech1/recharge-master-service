const app = require('../../src/app');

describe('\'contactus\' service', () => {
  it('registered the service', () => {
    const service = app.service('contactus');
    expect(service).toBeTruthy();
  });
});
