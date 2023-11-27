const app = require('../../../src/app');

describe('\'electricity/buy-electricity\' service', () => {
  it('registered the service', () => {
    const service = app.service('electricity/buy-electricity');
    expect(service).toBeTruthy();
  });
});
