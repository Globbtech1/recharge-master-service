const app = require('../../src/app');

describe('\'aboutus\' service', () => {
  it('registered the service', () => {
    const service = app.service('aboutus');
    expect(service).toBeTruthy();
  });
});
