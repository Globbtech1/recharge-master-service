const app = require('../../../src/app');

describe('\'virtualaccount/generateaccount\' service', () => {
  it('registered the service', () => {
    const service = app.service('virtualaccount/generateaccount');
    expect(service).toBeTruthy();
  });
});
