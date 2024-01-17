const app = require('../../../src/app');

describe('\'admin/specialOps\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/special-ops');
    expect(service).toBeTruthy();
  });
});
