const app = require('../../../src/app');

describe('\'electricity/my-beneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('electricity/my-beneficiaries');
    expect(service).toBeTruthy();
  });
});
