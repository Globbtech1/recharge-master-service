const app = require('../../../src/app');

describe('\'test/sampleSMS\' service', () => {
  it('registered the service', () => {
    const service = app.service('test/sample-sms');
    expect(service).toBeTruthy();
  });
});
