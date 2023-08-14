const app = require('../../src/app');

describe('\'waitlists\' service', () => {
  it('registered the service', () => {
    const service = app.service('waitlists');
    expect(service).toBeTruthy();
  });
});
