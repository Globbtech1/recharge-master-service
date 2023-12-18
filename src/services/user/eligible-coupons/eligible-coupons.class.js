const { Op, Sequelize } = require("sequelize");
const { CONSTANT } = require("../../../dependency/Config");
const { successMessage } = require("../../../dependency/UtilityFunctions");

/* eslint-disable no-unused-vars */
exports.EligibleCoupons = class EligibleCoupons {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    const UserCategory = CONSTANT.userCategories;
    let user = params?.user;
    let loggedInUserId = user?.id;
    const queryType = params?.query?.type ?? "all";
    const sequelize = this.app.get("sequelizeClient");
    console.log(queryType, "queryType");
    if (queryType === "available" || queryType === "all") {
      console.log(user, "user");
      // const sequelize = this.app.get("sequelizeClient");
      const { transactions_history, coupon_management, used_coupon } =
        sequelize.models;
      let cat = await getUserCategories(
        user,
        UserCategory,
        transactions_history
      );

      const userCategoryIds = cat.map((category) => category.id).join(",");

      // Query the model with the comma-separated userCategory values

      const usedCouponIds = await used_coupon.findAll({
        attributes: ["couponManagementId"],
        where: {
          userId: loggedInUserId,
        },
        raw: true,
      });

      const excludedCouponIds = usedCouponIds.map(
        (entry) => entry?.couponManagementId
      );
      console.log(excludedCouponIds, "excludedCouponIds");
      const result = await coupon_management.findAll({
        where: {
          userCategory: {
            [Sequelize.Op.in]: userCategoryIds.split(","),
          },
          id: {
            [Sequelize.Op.notIn]: excludedCouponIds,
          },
        },
      });

      return successMessage(
        result,
        `User Available coupon For this categories ( ${userCategoryIds.split(
          ","
        )} )`
      );
    }
    if (queryType === "used") {
      const loggedInUserId = user?.id;
      let result = await this.app.service("used-coupon").find({
        query: {
          userId: loggedInUserId,
        },
      });

      return Promise.resolve(successMessage(result, "Used Coupon"));
    }
    if (queryType === "expired") {
      const { transactions_history, coupon_management, used_coupon } =
        sequelize.models;

      const result = await coupon_management.findAll({
        where: {
          validity: {
            [Sequelize.Op.lt]: new Date(), // Filter coupons where the validity date is less than the current date
          },
        },
      });

      return successMessage(result, "expired coupons");
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
async function getUserCategories(user, userCategories, transactions_history) {
  const categories = [];

  // Check if the user is a new user (less than 1 day on rechargeMaster)
  if (isNewUser(user)) {
    categories.push(findUserCategory("new-users", userCategories));
  }

  // Check if the user is an inactive user (no transactions since onboarding)
  let isInactive = await isInactiveUser(user, transactions_history);
  console.log(isInactive, "isInactive");
  if (isInactive) {
    categories.push(findUserCategory("inactive-users", userCategories));
  }

  // Check if the user is an active user (minimum of 1 transaction per month)
  let isActive = await isActiveUser(user, transactions_history);
  // console.log(isActive, "isActive");
  if (isActive) {
    categories.push(findUserCategory("active-users", userCategories));
  }

  // If the user doesn't fall into any of the above categories, add them to the "All users" category
  // if (categories.length === 0) {
  categories.push(findUserCategory("all-users", userCategories));
  // }

  return categories;
}

function isNewUser(user) {
  // Calculate the time difference between the current date and the user's creation date
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const userCreationTime = new Date(user.createdAt).getTime();
  const timeDifference = currentTime - userCreationTime;

  return timeDifference < oneDayInMilliseconds;
}

async function isInactiveUser(user, transactionHistory) {
  // check if there have been no transactions since onboarding

  const userTransactions = await transactionHistory?.count({
    where: {
      userId: user?.id, // Replace with the actual user ID property
    },
  });
  console.log(userTransactions, "userTransactions");
  // Check if there are no transactions for the user
  return userTransactions == 0;
}

async function isActiveUser(user, transactionHistory) {
  // Calculate the current date and time
  const currentDate = new Date();

  // Calculate the date exactly one month ago from the current date
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Count the number of transactions for the user within the past month
  const transactionCount = await transactionHistory?.count({
    where: {
      userId: user?.id, // Replace with the actual user ID property
      transactionDate: {
        [Op.between]: [oneMonthAgo, currentDate],
      },
    },
  });
  // Compare the count with the minimum required number of transactions (1)
  let isActive = transactionCount >= 1;
  return isActive;
}

function findUserCategory(categoryId, userCategories) {
  return userCategories.find((category) => category.id === categoryId);
}
