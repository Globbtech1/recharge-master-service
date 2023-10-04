const app = require('../../../src/app');

describe('\'integrations/EmailService\' service', () => {
  it('registered the service', () => {
    const service = app.service('integrations/email-service');
    expect(service).toBeTruthy();
  });
});
