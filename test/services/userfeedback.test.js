const app = require('../../src/app');

describe('\'userfeedback\' service', () => {
  it('registered the service', () => {
    const service = app.service('userfeedback');
    expect(service).toBeTruthy();
  });
});
