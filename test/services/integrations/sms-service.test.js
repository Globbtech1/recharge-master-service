const app = require('../../../src/app');

describe('\'integrations/SmsService\' service', () => {
  it('registered the service', () => {
    const service = app.service('integrations/sms-service');
    expect(service).toBeTruthy();
  });
});
