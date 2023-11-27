/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");
const { successMessage } = require("../../../dependency/UtilityFunctions");

exports.MyBeneficiaries = class MyBeneficiaries {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const sequelize = this.app.get("sequelizeClient");
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    const paymentId = query?.paymentId || 0;
    if (paymentId === 0) {
      return Promise.reject(new BadRequest("Payment Id is required"));
    }

    let result = await this.app.service("user/quick-beneficiary").find({
      query: {
        userId: loggedInUserId,
        productId: paymentId,
        $select: ["sourceImage", "uniqueNumber", "nameAlias", "metaData"],
      },
    });

    return Promise.resolve(
      successMessage(result, "   User saved Data Beneficiary")
    );
  }
};
