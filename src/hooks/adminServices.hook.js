// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const Sentry = require("@sentry/node");

// const { Op } = require("sequelize");
const { Op, Sequelize } = require("sequelize");

const {
  generateRandomNumber,
  errorMessage,
  successMessage,
  generateRandomString,
  ShowCurrentDate,
  convertToNaira,
  convertToKobo,
  getProviderSourceImage,
  compareHashData,
  removeSensitiveKeys,
  calculateBillNextExecutionDate,
} = require("../dependency/UtilityFunctions");

const {
  changeUserEmailValidator,
  userEmailVerifyValidator,
} = require("../validations/auth.validation");
const { ReserveBankAccount, pushSlackNotification } = require("./general-uses");
const { getUserAccountBalanceInfo } = require("./userFund.hook");
const { CONSTANT } = require("../dependency/Config");

// eslint-disable-next-line no-unused-vars
const generateCouponNumber = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { coupon_management, generateaccount } = sequelize.models;

    // let loggedInUser = params.user.id;
    const { couponCode } = data;
    if (!couponCode || couponCode === "") {
      const couponCodeGenerated = await generateRandomNumber(
        coupon_management,
        "couponCode",
        8,
        true
      );
      let AdditionalData = {
        couponCode: couponCodeGenerated,
      };

      context.data = { ...context.data, ...AdditionalData };
    }

    return context;
  };
};
// Extracts the total TNX count
async function getTotalTNXCount(transactions_history) {
  return transactions_history.count();
}

// Extracts the total TNX amount
async function getTotalTNXAmount(transactions_history) {
  return transactions_history.sum("amountPaid");
}

// Extracts the total active user count
async function getActiveUserCount(
  users,
  transactions_history,
  account_balance
  // Sequelize,
  // Op
) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  return users.count({
    distinct: true,
    include: [
      {
        model: transactions_history,
        as: "transactionsHistory",
        where: {
          userId: Sequelize.literal(
            "`users`.`id` = `transactionsHistory`.`userId`"
          ),
          transactionDate: {
            [Op.gte]: lastMonth,
          },
        },
      },
    ],
  });
}

// Extracts the total wallet funding
async function getTotalWalletFunding(account_funding) {
  return account_funding.sum("amount");
}

// Extracts the total pending TNX count
async function getTotalPendingTNX(transactions_history) {
  return transactions_history.count({
    where: {
      transactionStatus: "Pending",
    },
  });
}

// Extracts the total failed TNX count
async function getTotalFailedTNX(transactions_history) {
  return transactions_history.count({
    where: {
      transactionStatus: "Failed",
    },
  });
}

// Extracts the total successful TNX count
async function getTotalSuccessfulTNX(transactions_history) {
  return transactions_history.count({
    where: {
      transactionStatus: "Successful",
    },
  });
}

// Extracts the total wallet value
async function getTotalWalletValue(account_balance) {
  return account_balance.sum("balance");
}

async function getTotalAirtimeTNX(transactions_history) {
  return transactions_history.sum("amountPaid", {
    where: {
      transactionType: CONSTANT.transactionType.airtime,
    },
  });
}
async function getTotalDataTNX(transactions_history) {
  return transactions_history.sum("amountPaid", {
    where: {
      transactionType: CONSTANT.transactionType.data,
    },
  });
}

const calculatePaymentModePercentages = async (model, paymentField) => {
  const allSales = await model?.findAll();

  const countOccurrences = (field) => {
    const counts = {};
    allSales.forEach((sale) => {
      const value = sale[field];
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  };

  const calculatePercentages = (counts, total) => {
    const percentages = {};
    for (const value in counts) {
      const count = counts[value];
      percentages[value] = (count / total) * 100;
    }
    return percentages;
  };

  const paymentModeCounts = countOccurrences(paymentField);
  const totalSales = allSales.length;

  return calculatePercentages(paymentModeCounts, totalSales);
};
async function getDailySignUpCount({ users, startDate, endDate } = {}) {
  // Set default start and end date if not provided
  startDate = startDate || new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
  endDate = endDate || new Date();

  // Replace 'YourUserModel' with the actual name of your user model
  const signUps = await users.findAll({
    attributes: [
      [Sequelize.literal("DATE(createdAt)"), "date"],
      [Sequelize.fn("COUNT", "id"), "count"],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.literal("DATE(createdAt)")],
    raw: true,
  });

  // Format the result for plotting
  const result = signUps.map((entry) => ({
    date: entry.date,
    count: entry.count,
  }));

  return result;
}
async function getSalesPerProduct({
  transactions_history,
  startDate,
  endDate,
} = {}) {
  // Set default start and end date if not provided
  startDate = startDate || new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
  endDate = endDate || new Date();

  const sales = await transactions_history.findAll({
    attributes: [
      "transactionType",
      [Sequelize.fn("SUM", Sequelize.col("amountPaid")), "totalSales"],
    ],
    where: {
      transactionStatus: CONSTANT.transactionStatus.success,
      transactionDate: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    group: ["transactionType"],
    raw: true,
  });

  // Format the result for plotting
  const result = sales.map((entry) => ({
    productType: entry.transactionType,
    totalSales: entry.totalSales,
  }));

  return result;
}

// Example usage:
// const salesPerProduct = await getSalesPerProduct({
//   startDate: "2023-11-01T00:00:00.000Z",
//   endDate: "2023-11-07T23:59:59.999Z",
// });
// console.log(salesPerProduct);

module.exports = {
  generateCouponNumber,
  getTotalTNXCount,
  getTotalTNXAmount,
  getActiveUserCount,
  getTotalWalletFunding,
  getTotalPendingTNX,
  getTotalFailedTNX,
  getTotalSuccessfulTNX,
  getTotalWalletValue,
  getTotalAirtimeTNX,
  getTotalDataTNX,
  calculatePaymentModePercentages,
  getDailySignUpCount,
  getSalesPerProduct,
};
