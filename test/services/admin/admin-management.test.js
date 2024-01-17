const app = require('../../../src/app');

describe('\'admin/adminManagement\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/admin-management');
    expect(service).toBeTruthy();
  });
});
