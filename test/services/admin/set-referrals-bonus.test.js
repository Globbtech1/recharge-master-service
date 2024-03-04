const app = require('../../../src/app');

describe('\'admin/setReferralsBonus\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/set-referrals-bonus');
    expect(service).toBeTruthy();
  });
});
