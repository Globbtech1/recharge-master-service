const app = require('../../../src/app');

describe('\'globalservice/allEnums\' service', () => {
  it('registered the service', () => {
    const service = app.service('globalservice/all-enums');
    expect(service).toBeTruthy();
  });
});
