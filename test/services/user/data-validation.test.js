const app = require('../../../src/app');

describe('\'user/dataValidation\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/data-validation');
    expect(service).toBeTruthy();
  });
});
