const app = require('../../../src/app');

describe('\'schedulePayment/scheduleBillsPayment\' service', () => {
  it('registered the service', () => {
    const service = app.service('schedulePayment/schedule-bills-payment');
    expect(service).toBeTruthy();
  });
});
