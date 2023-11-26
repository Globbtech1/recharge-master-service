const app = require('../../../src/app');

describe('\'user/myReferers\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/my-referers');
    expect(service).toBeTruthy();
  });
});
