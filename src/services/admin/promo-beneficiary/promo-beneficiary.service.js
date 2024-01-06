// Initializes the `admin/promoBeneficiary` service on path `/admin/promo-beneficiary`
const { PromoBeneficiary } = require("./promo-beneficiary.class");
const hooks = require("./promo-beneficiary.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/admin/promo-beneficiary", new PromoBeneficiary(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("admin/promo-beneficiary");

  service.hooks(hooks);
};
