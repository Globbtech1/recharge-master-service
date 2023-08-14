const app = require('../../../src/app');

describe('\'electricity/validate-meter-number\' service', () => {
  it('registered the service', () => {
    const service = app.service('electricity/validate-meter-number');
    expect(service).toBeTruthy();
  });
});
