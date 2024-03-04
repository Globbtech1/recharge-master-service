const app = require('../../src/app');

describe('\'userReferralListBonus\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-referral-list-bonus');
    expect(service).toBeTruthy();
  });
});
