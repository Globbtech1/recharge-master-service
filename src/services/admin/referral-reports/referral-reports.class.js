const { successMessage } = require("../../../dependency/UtilityFunctions");
const {
  sumPendingBonusAmounts,
  countAllReferrals,
  sumClaimedBonusAmounts,
  sumAllBonusAmounts,
} = require("../../../hooks/adminServices.hook");
const usersModel = require("../../../models/users.model");

/* eslint-disable no-unused-vars */
exports.ReferralReports = class ReferralReports {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { users, user_verifications, user_referral_list_bonus } =
        sequelize.models;
      // Fetch all users with their referral counts

      const usersWithReferralCounts = await users.getUsersWithReferralCounts();
      const pendingBonusAmounts = await sumPendingBonusAmounts(
        user_referral_list_bonus
      );
      const AllReferrals = await countAllReferrals(user_referral_list_bonus);
      const claimedBonusAmounts = await sumClaimedBonusAmounts(
        user_referral_list_bonus
      );
      const allBonusAmounts = await sumAllBonusAmounts(
        user_referral_list_bonus
      );
      let data = {
        AllReferrals,
        claimedBonusAmounts,
        allBonusAmounts,
        pendingBonusAmounts,
        usersWithReferralCounts,
      };
      // Return the user list along with the referral count
      return successMessage(data);
    } catch (error) {
      console.error("Error fetching referral reports:", error);
      throw new Error("Failed to fetch referral reports");
    }
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
