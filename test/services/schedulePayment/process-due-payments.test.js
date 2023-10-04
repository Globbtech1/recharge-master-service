const app = require('../../../src/app');

describe('\'schedulePayment/processDuePayments\' service', () => {
  it('registered the service', () => {
    const service = app.service('schedulePayment/process-due-payments');
    expect(service).toBeTruthy();
  });
});
