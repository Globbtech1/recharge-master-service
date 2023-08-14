const app = require('../../src/app');

describe('\'SUBMISSIONSTOPIC\' service', () => {
  it('registered the service', () => {
    const service = app.service('submissionstopic');
    expect(service).toBeTruthy();
  });
});
