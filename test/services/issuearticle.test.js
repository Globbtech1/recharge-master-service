const app = require('../../src/app');

describe('\'issuearticle\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuearticle');
    expect(service).toBeTruthy();
  });
});
