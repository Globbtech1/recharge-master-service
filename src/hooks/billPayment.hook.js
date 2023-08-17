// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const Sentry = require("@sentry/node");

const { Op } = require("sequelize");
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
} = require("../dependency/UtilityFunctions");

const {
  changeUserEmailValidator,
  userEmailVerifyValidator,
} = require("../validations/auth.validation");
const { ReserveBankAccount, pushSlackNotification } = require("./general-uses");
const { getUserAccountBalanceInfo } = require("./userFund.hook");

// eslint-disable-next-line no-unused-vars

const checkAvailableBalance = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    // console.log(data, "dataSent");
    const { account_balance } = sequelize.models;
    let loggedInUserId = params?.user?.id;
    // console.log(loggedInUserId, "loggedInUserIds");
    const accountBalance = await account_balance.findOne({
      where: {
        userId: loggedInUserId,
        deletedAt: null,
      },
    });
    // console.log(accountBalance, "submissionData");
    if (accountBalance !== null) {
      // console.log(accountBalance, "accountBalance");
      const { balance } = accountBalance;
      const { amount } = data;
      if (amount > balance) {
        const insufficient = new BadRequest(
          "insufficient balance , please top up your account"
        );
        return Promise.reject(insufficient);
      }
      let additionalOrderDetails = {
        availableBalance: balance,
      };
      context.data = { ...data, ...additionalOrderDetails };
    } else {
      const notFound = new BadRequest(
        "Can not complete request, please check your user account"
      );
      return Promise.reject(notFound);
    }

    return context;
  };
};
const validateMobileNumber = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    const { phoneNumber } = data;
    let cleanedUpPhoneNumber = phoneNumber?.replace(/[^+\d]+/g, "");
    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/); // if phoneNumber // is empty return false
    if (cleanedUpPhoneNumber == null) {
      //TODO Make All phone number start with 0 instead of country code
      const error = new BadRequest(
        "Invalid mobile Number , Please check and try again "
      );
      return Promise.reject(error);
    } // Return true if the phoneNumber // matched the ReGex
    if (regex.test(cleanedUpPhoneNumber) == false) {
      const error = new BadRequest(
        "Invalid mobile Number , Please check and try again "
      );
      return Promise.reject(error);
    }

    let additionalOrderDetails = {
      phoneNumber: cleanedUpPhoneNumber,
      uniqueTransIdentity: cleanedUpPhoneNumber,
    };
    context.data = { ...data, ...additionalOrderDetails };

    return context;
  };
};
const debitUserAccount = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");

    const { account_balance } = sequelize.models;
    const { amount } = data;
    let loggedInUserId = params?.user?.id;
    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUserId,
      },
    });

    if (account_balanceDetails !== null) {
      let availableBalance = account_balanceDetails?.balance;
      let currentBalance = parseFloat(availableBalance) - amount;
      let walletId = account_balanceDetails?.id;
      let Update_payload = {
        balance: currentBalance,
      };
      app.service("account-balance").patch(walletId, Update_payload);
    } else {
      return Promise.reject(new BadRequest("Unable to complete your request"));
    }

    return context;
  };
};
const logErrorToDb = (options = {}) => {
  return async (context) => {
    try {
      const { app, method, result, params, data, id, error } = context;
      // console.log(error, "errormmmmmmm");
      Sentry.captureException(error);
      const sequelize = app.get("sequelizeClient");
      const { account_balance } = sequelize.models;
      let amount = data?.amount;
      let loggedInUserId = params?.user?.id;
      const errorLogs = {
        userId: loggedInUserId,
        amount: amount || 0,
        error: JSON.stringify(error),
        userData: JSON.stringify(data),
      };
      // pushSlackNotification(errorLogs, "error");

      // app.service("transaction-error-logs").create(errorLogs);

      return context;
    } catch (err) {
      Sentry.captureException(err);

      // Handle the error here if necessary
      // console.error(err);
      // throw err; // Re-throw the error to be caught by the global error handler
    }
  };
};
const recordUserCashBack = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    console.log(result, "resultkkkkkkkk");
    const { account_balance, payment_list, payment_providers } =
      sequelize.models;
    const { amount, paymentId, provider } = data;

    let loggedInUserId = params?.user?.id;
    let transactionsHistoryId = result?.id;

    const userAccountBalance = await getUserAccountBalanceInfo(
      account_balance,
      loggedInUserId
    );
    console.log(userAccountBalance, "userAccountBalance");
    if (userAccountBalance != false) {
      let cashBackBalance = userAccountBalance?.cashBackBalance || 0;
      // const paymentListDetails = await payment_list.findOne({
      //   where: {
      //     deletedAt: null,
      //     id: paymentId,
      //   },
      // });
      // const PaymentProvidersDetails = await payment_providers.findOne({
      //   where: {
      //     deletedAt: null,
      //     provider: provider,
      //   },
      // });
      const PaymentProvidersDetails = await getSingleProvidersV2(
        payment_providers,
        provider,
        paymentId
      );
      if (PaymentProvidersDetails !== null) {
        console.log(PaymentProvidersDetails, "PaymentProvidersDetails");
        let percentageToGiveback = PaymentProvidersDetails?.cashBackPercentage;
        let userPurchaseAmount = convertToNaira(amount);
        let cashBackAmount = (percentageToGiveback / 100) * userPurchaseAmount;
        // let cashBackAmount = 90;
        console.log(cashBackAmount, "cashBackAmount.......befpre ");
        cashBackAmount = parseFloat(cashBackAmount);
        console.log(cashBackAmount, "cashBackAmount.......");
        let newCashBackAmount =
          parseFloat(convertToKobo(cashBackAmount)) +
          parseFloat(cashBackBalance);
        let walletId = userAccountBalance?.id;

        //////////////////////

        const cashBackData = {
          userId: loggedInUserId,
          amount: convertToNaira(amount),
          amountBefore: convertToNaira(cashBackBalance),
          amountAfter: convertToNaira(newCashBackAmount),
          cashBackAmount: cashBackAmount,
          paymentListId: paymentId,
          transactionsHistoryId: transactionsHistoryId || 0,
          metaData: JSON.stringify(data),
        };

        app.service("cashBack/reward-user").create(cashBackData);

        ///////////////////////////////////
        let Update_payload = {
          cashBackBalance: newCashBackAmount,
        };
        var condition = {
          where: {
            id: walletId,
            deletedAt: null,
          },
        };
        await account_balance.update(Update_payload, condition);
      } else {
        let errorMessage =
          "Unable to record cash back for customer. Payment provider details not set";
        pushSlackNotification(errorMessage, "error");
      }
    }

    return context;
  };
};
const recordQuickBeneficiary = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { quick_beneficiary, payment_providers } = sequelize.models;
    const {
      amount,
      paymentId,
      saveBeneficiary,
      beneficiaryAlias,
      uniqueTransIdentity,
      provider,
    } = data;
    let paymentProviders = await getAllProvidersV2(payment_providers);
    let providerDetails = getProviderSourceImage(paymentProviders, provider);
    console.log(data, "data....");
    console.log(providerDetails, "providerDetails");
    let loggedInUserId = params?.user?.id;
    let providerImage = providerDetails?.image || "";
    if (
      saveBeneficiary &&
      saveBeneficiary === true &&
      beneficiaryAlias &&
      beneficiaryAlias != ""
    ) {
      const quickBeneficiaryList = await quick_beneficiary.findOne({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
          paymentListId: paymentId,
          uniqueNumber: uniqueTransIdentity,
        },
      });
      if (quickBeneficiaryList === null) {
        const quickBeneficiaryData = {
          userId: loggedInUserId,
          sourceImage: providerImage,
          nameAlias: beneficiaryAlias,
          paymentListId: paymentId,
          metaData: JSON.stringify(data),
          uniqueNumber: uniqueTransIdentity,
        };
        app.service("user/quick-beneficiary").create(quickBeneficiaryData);
      }
    }

    return context;
  };
};
const includeBillDetails = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { payment_list } = sequelize.models;
    params.sequelize = {
      include: [
        {
          model: payment_list,
          attributes: ["name", "slug", "image"],
        },
      ],
      raw: false,
    };

    return context;
  };
};
const FormatResponseProfile = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    console.log(result, "heheheh");
    // context.result = successMessage(result, "Account verified successfully");
    // return context;
  };
};

const validateTransactionPin = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    const { users } = sequelize.models;
    let loggedInUserId = params?.user?.id;
    const { userPin } = data;
    const userDetails = await users.findOne({
      where: {
        id: loggedInUserId,
        deletedAt: null,
      },
    });
    // console.log(userDetails, "submissionData");
    // console.log(userPin, "userPin");
    if (userDetails !== null) {
      const { securityPin } = userDetails;
      if (securityPin === null) {
        const insufficient = new BadRequest(
          "Security pin not set. please set it and try again "
        );
        return Promise.reject(insufficient);
      }

      let userPinCorrect = await compareHashData(userPin, securityPin);
      // console.log(userPinCorrect, "userPinCorrect");
      if (!userPinCorrect) {
        return Promise.reject(new BadRequest("Incorrect Transaction Pin"));
      }
    } else {
      const notFound = new BadRequest(
        "Can not complete request, please contact support..."
      );
      return Promise.reject(notFound);
    }

    return context;
  };
};
const getAllProviders = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id, error } = context;
    const sequelize = app.get("sequelizeClient");
    const { payment_providers, payment_list } = sequelize.models;
    // const {
    //   amount,
    //   paymentId,
    //   saveBeneficiary,
    //   beneficiaryAlias,
    //   uniqueTransIdentity,
    //   provider,
    // } = data;

    const paymentProvidersList = await payment_providers.findAll({
      where: {
        deletedAt: null,
      },
    });
    let paymentProviders = paymentProvidersList || [];
    paymentProviders = JSON.stringify(paymentProviders);
    paymentProviders = JSON.parse(paymentProviders);

    let additionalOrderDetails = {
      paymentProviders: paymentProviders,
    };

    context.data = { ...context.data, ...additionalOrderDetails };

    return context;
  };
};

const getAllProvidersV2 = async (payment_providers) => {
  const paymentProvidersList = await payment_providers.findAll({
    where: {
      deletedAt: null,
    },
  });
  let paymentProviders = paymentProvidersList || [];
  paymentProviders = JSON.stringify(paymentProviders);
  paymentProviders = JSON.parse(paymentProviders);
  return paymentProviders;
};
const getSingleProvidersV2 = async (payment_providers, provider, paymentId) => {
  const PaymentProvidersDetails = await payment_providers.findOne({
    where: {
      deletedAt: null,
      provider: provider,
      paymentListId: paymentId,
    },
  });
  // let paymentProviders = paymentProvidersList || [];
  // paymentProviders = JSON.stringify(paymentProviders);
  // paymentProviders = JSON.parse(paymentProviders);
  return PaymentProvidersDetails;
};
module.exports = {
  checkAvailableBalance,
  debitUserAccount,
  validateMobileNumber,
  logErrorToDb,
  recordUserCashBack,
  recordQuickBeneficiary,
  includeBillDetails,
  getAllProviders,
  validateTransactionPin,
  getAllProvidersV2,
  getSingleProvidersV2,
};
