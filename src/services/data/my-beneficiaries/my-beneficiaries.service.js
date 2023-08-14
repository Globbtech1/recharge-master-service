// Initializes the `data/myBeneficiaries` service on path `/data/my-beneficiaries`
const { MyBeneficiaries } = require("./my-beneficiaries.class");
const hooks = require("./my-beneficiaries.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/data/my-beneficiaries", new MyBeneficiaries(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("data/my-beneficiaries");

  service.hooks(hooks);
};
