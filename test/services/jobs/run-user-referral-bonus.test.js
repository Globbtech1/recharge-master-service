const app = require('../../../src/app');

describe('\'jobs/runUserReferralBonus\' service', () => {
  it('registered the service', () => {
    const service = app.service('jobs/run-user-referral-bonus');
    expect(service).toBeTruthy();
  });
});
