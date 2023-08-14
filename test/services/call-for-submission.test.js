const app = require('../../src/app');

describe('\'CallForSubmission\' service', () => {
  it('registered the service', () => {
    const service = app.service('call-for-submission');
    expect(service).toBeTruthy();
  });
});
