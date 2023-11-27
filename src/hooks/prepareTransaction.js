const { NotFound, GeneralError, BadRequest } = require("@feathersjs/errors");

const { BaxiIntegration } = require("../interfaces/baxiIntegration");
const verifyRequestProvider = (PaymentSlug) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { payment_list } = sequelize.models;
    const paymentDetails = await payment_list.findOne({
      where: {
        deletedAt: null,
        slug: PaymentSlug,
        isActive: true,
      },
    });
    if (paymentDetails === null) {
      const notFound = new BadRequest(
        "This bill payment was not found or is currently unavailable." //TODO remove - from slug and return the slug name as response
      );
      return Promise.reject(notFound);
    }
    let providerTpe = paymentDetails.provider;
    let providerClass = selectProvider(providerTpe);
    context.params["billMethodDetails"] = providerClass;
    return context;
  };
};
const selectProvider = (provider) => {
  if (provider === "BAXI") {
    const Baxi = new BaxiIntegration("BaxiIntegration", "info");
    return Baxi;
  }
};
// const includeBillDetails = (options = {}) => {
//   return async (context) => {
//     const { app, method, result, params, data } = context;
//     const sequelize = app.get("sequelizeClient");
//     const { payment_list } = sequelize.models;
//     params.sequelize = {
//       include: [
//         {
//           model: payment_list,
//           attributes: ["name", "slug", "image"],
//         },
//       ],
//       raw: false,
//     };

//     return context;
//   };
// };
module.exports = {
  verifyRequestProvider,
  // includeBillDetails,
};
