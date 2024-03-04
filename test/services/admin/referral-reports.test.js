const app = require('../../../src/app');

describe('\'admin/referralReports\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/referral-reports');
    expect(service).toBeTruthy();
  });
});
