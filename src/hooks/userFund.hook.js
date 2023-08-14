// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  convertToKobo,
  successMessage,
} = require("../dependency/UtilityFunctions");

const ReserveBankAccount = async (Info, record = true) => {
  try {
    const {
      userId,
      accountName,
      customerEmail,
      bankCode,
      generateAccount,
      accountReference,
    } = Info;
    const Monnify = new MonifyIntegration();
    let dataPay = {
      userId: userId,
      accountName: accountName,
      customerEmail: customerEmail,
      bankCode: bankCode,
      accountReference: accountReference,
    };
    let resp = await Monnify.reserveAccountNumber(dataPay);
    let accountDetailsArray = resp.accounts;
    let accountMonifyReference = resp.accountReference;
    let accountDetails = {};
    if (record) {
      if (accountDetailsArray.length > 0) {
        accountDetails = accountDetailsArray[0];
        console.log(accountDetails, "accountDetails");
        generateAccount.create({
          userId: userId,
          bankName: accountDetails?.bankName,
          accountNumber: accountDetails?.accountNumber,
          accountReference: accountMonifyReference,
          otherDetails: resp,
          bankCode: bankCode,
        });
      }
    } else {
      return resp;
    }
  } catch (error) {
    console.log(error, "error????");
    // return res.status(500).json(errorMessage("An error occurred", error, 500));
    return false;
  }
};
const FundUserAccount = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { amount, loggedInUser } = data;
    const { account_balance } = sequelize.models;
    let availableBalance = 0;
    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUser,
      },
    });
    if (account_balanceDetails !== null) {
      availableBalance = account_balanceDetails?.balance;
      let currentBalance =
        parseFloat(availableBalance) + parseFloat(convertToKobo(amount));
      let walletId = account_balanceDetails?.id;
      let Update_payload = {
        balance: currentBalance,
      };
      var condition = {
        where: {
          id: walletId,
          deletedAt: null,
        },
      };
      await account_balance.update(Update_payload, condition);
    } else {
      let currentBalance =
        parseFloat(availableBalance) + parseFloat(convertToKobo(amount));
      console.log(currentBalance, "currentBalance");

      let payload = {
        userId: loggedInUser,
        balance: currentBalance,
        ledgerBalance: currentBalance,
      };
      await account_balance.create(payload);
    }
    return context;
  };

  ////////////////////////////
};
const KeepFundingHistory = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const { accountFundingData } = result;
    const sequelize = app.get("sequelizeClient");
    const { account_balance } = sequelize.models;
    app.service("account-funding").create(accountFundingData);

    return context;
  };
};
const KeepPaymentHistory = () => {
  return async (context) => {
    // console.log(context, "context");
    const { app, method, result, params, data } = context;
    console.log(params, "params");
    console.log(result, "result");
    const { payHistory } = result;
    const sequelize = app.get("sequelizeClient");
    const { account_balance } = sequelize.models;
    app.service("transactions-history").create(payHistory);

    return context;
  };
};
const getUserAccountBalanceInfo = async (
  account_balanceModel,
  loggedInUserId
) => {
  try {
    const userAccountBalance = await account_balanceModel.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUserId,
      },
      attributes: {
        exclude: [
          "deletedAt",
          "createdAt",
          "updatedAt",
          "deviceId",
          "fcmToken",
          "password",
        ],
      },
    });

    // let accountBalance = userAccountBalance?.balance || 0;
    // let ledgerBalanceBalance = userAccountBalance?.ledgerBalance || 0;
    return userAccountBalance;
  } catch (error) {
    console.log(error, "error????");
    // return res.status(500).json(errorMessage("An error occurred", error, 500));
    return false;
  }
};
module.exports = {
  FundUserAccount,
  ReserveBankAccount,
  KeepFundingHistory,
  KeepPaymentHistory,
  getUserAccountBalanceInfo,
};
