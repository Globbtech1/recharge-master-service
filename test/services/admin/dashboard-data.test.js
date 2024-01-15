const app = require('../../../src/app');

describe('\'admin/dashboardData\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/dashboard-data');
    expect(service).toBeTruthy();
  });
});
