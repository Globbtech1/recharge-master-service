const { NotFound, BadRequest } = require("@feathersjs/errors");
const {
  successMessage,
  convertToKobo,
  ShowCurrentDate,
} = require("../../../dependency/UtilityFunctions");
const {
  calculateTotalUserSpent,
  creditUserAccountManually,
} = require("../../../hooks/adminServices.hook");

/* eslint-disable no-unused-vars */
exports.RunUserReferralBonus = class RunUserReferralBonus {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const { user, query } = params;
    console.log(query, "parameter");
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    const { transactions_history, set_referrals_bonus } = sequelize.models;
    const referralBonus = await set_referrals_bonus.findOne({
      where: {
        deletedAt: null,
      },
    });
    if (referralBonus === null) {
      return Promise.reject(
        new BadRequest("referral bonus is yet to be set by admin")
      );
    }
    console.log(referralBonus, "referralBonus");
    let userMinimumSpent = referralBonus?.minimumSpentAmount;
    console.log(userMinimumSpent, "userMinimumSpent");

    let result = await this.app.service("user-referral-list-bonus").find({
      query: {
        isBonusPaid: false,
        // productListId: productId,
        // $select: ["sourceImage", "uniqueNumber", "nameAlias", "metaData"],
      },
    });
    let unpaidBonus = result?.data;
    unpaidBonus.forEach(async (element) => {
      console.log(element, "element");
      let userId = element?.userId;
      let referredUserId = element?.referredUserId;
      let bonusAmount = element?.bonusAmount;
      let referredUser = element?.referredUser;
      let recordId = element?.id;
      let userSpent = await calculateTotalUserSpent(
        referredUserId,
        transactions_history
      );
      console.log(userSpent, "userSpent");
      if (userSpent < userMinimumSpent) {
        console.log(
          userSpent,
          "userSpent",
          userMinimumSpent,
          "userMinimumSpent",

          "condition not met yet",
          recordId,
          "recordId"
        );
      } else {
        console.log("tryig to credit this user", userId);
        let amountInKobo = convertToKobo(bonusAmount);
        let ress = await creditUserAccountManually(
          this.app,
          referredUser,
          amountInKobo,
          userId
        );
        console.log(ress, "ress");
        // if (ress) {
        element.isBonusPaid = true;
        element.bonusPaidOn = ShowCurrentDate();
        await element.save();
        // }
      }
    });

    return Promise.resolve(successMessage(unpaidBonus, "Run successfully"));
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
