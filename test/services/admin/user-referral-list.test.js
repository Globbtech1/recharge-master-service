const app = require('../../../src/app');

describe('\'admin/user-referral-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/user-referral-list');
    expect(service).toBeTruthy();
  });
});
