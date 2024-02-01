const app = require('../../../src/app');

describe('\'test/sampleEmail\' service', () => {
  it('registered the service', () => {
    const service = app.service('test/sample-email');
    expect(service).toBeTruthy();
  });
});
