// Initializes the `user/deleteSchedulePayment` service on path `/user/delete-schedule-payment`
const { DeleteSchedulePayment } = require("./delete-schedule-payment.class");
const hooks = require("./delete-schedule-payment.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/user/delete-schedule-payment",
    new DeleteSchedulePayment(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("user/delete-schedule-payment");

  service.hooks(hooks);
};
