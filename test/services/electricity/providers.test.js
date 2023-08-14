const app = require('../../../src/app');

describe('\'electricity/providers\' service', () => {
  it('registered the service', () => {
    const service = app.service('electricity/providers');
    expect(service).toBeTruthy();
  });
});
