// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { CONSTANT } = require("../dependency/Config");
const {
  convertToKobo,
  successMessage,
  generateRandomNumber,
  convertToNaira,
  ShowCurrentDate,
  generateRandomString,
  normalizePhoneNumber,
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
    const { amount = 0, loggedInUser } = data;

    console.log(data, "lllllll");
    console.log(result, "result");
    const { id } = result;
    const { account_balance } = sequelize.models;
    let availableBalance = 0;
    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: id,
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
        userId: id,
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

const generateWalletId = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    // console.log(params, "params");
    // console.log(result, "result");
    const { password, phoneNumber } = data;

    const sequelize = app.get("sequelizeClient");
    const { users } = sequelize.models;
    let walletId = await generateRandomNumber(users, "walletId", 12);
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    let AdditionalData = {
      // walletId: walletId,
      walletId: normalizedPhoneNumber,
      userPassword: password,
      userPassword2: "password",
    };

    context.data = { ...context.data, ...AdditionalData };
    return context;
  };
};
const generateReferLink = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    // console.log(params, "params");
    // console.log(result, "result");
    const sequelize = app.get("sequelizeClient");
    const { users } = sequelize.models;
    let walletId = await generateRandomNumber(users, "refererLink", 15);
    console.log(walletId, "walletId.....");
    let AdditionalData = {
      refererLink: walletId,
    };
    context.data = { ...context.data, ...AdditionalData };
    return context;
  };
};
const validateReferByLink = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    console.log(params, "params");
    console.log(result, "result");
    const sequelize = app.get("sequelizeClient");
    const { users } = sequelize.models;
    const { invitedBy, password } = data;
    if (invitedBy) {
      const account_balanceDetails = await users.findOne({
        where: {
          deletedAt: null,
          refererLink: invitedBy,
        },
      });
      if (account_balanceDetails == null) {
        throw new Error("Invalid referral code supply");
      }
      console.log(password, ".....password");
      let AdditionalData = {
        userPassword: password,
        userPassword2: "password",
        refererLink: invitedBy,
      };
      context.data = { ...context.data, ...AdditionalData };
    }

    return context;
  };
};

const creditUserAccount = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    // console.log(data, "pppppppppp");
    // console.log(result, "result");
    // console.log(params, "params");
    const { user } = params;
    const loggedInUserId = user?.id;
    const { amount } = data;
    const { receiverAccountId } = result;
    const { account_balance, product_list } = sequelize.models;
    let availableBalance = 0;
    let amountPaid = convertToNaira(amount);
    let AccountingFundingSource = "Wallet transfer";
    let paymentMethod = "Wallet Transfer";
    let transactionReference = await generateRandomString();

    const account_balanceDetails = await account_balance.findOne({
      where: {
        deletedAt: null,
        userId: receiverAccountId,
      },
    });
    const product_listDetails = await product_list.findOne({
      where: {
        deletedAt: null,
        slug: CONSTANT.AccountFunding,
      },
    });

    if (account_balanceDetails !== null) {
      availableBalance = account_balanceDetails?.balance;
      let currentBalance = parseFloat(availableBalance) + parseFloat(amount);
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
      console.log(Update_payload, "Update_payload");
      await account_balance.update(Update_payload, condition);

      let funding = {
        userId: receiverAccountId,
        amount: amountPaid,
        amountBefore: convertToNaira(availableBalance),
        amountAfter: convertToNaira(currentBalance),
        source: AccountingFundingSource,
      };
      let metaData = {
        amount: amountPaid,
        paymentMethod: paymentMethod,
        // ...accountDetails,
        transactionDate: ShowCurrentDate(),
      };
      let fundingHistory = {
        userId: receiverAccountId,
        paymentType: "credit",
        amountBefore: convertToNaira(availableBalance),
        amountAfter: convertToNaira(currentBalance),
        referenceNumber: transactionReference,
        metaData: JSON.stringify(metaData),
        productListId: product_listDetails?.id || 0,
        transactionDate: ShowCurrentDate(),
        amount: amountPaid,
        transactionStatus: CONSTANT.transactionStatus.success,
        paidBy: "Wallet Transfer",
        paymentMethod: "wallet",
        amountPaid: convertToNaira(0),
      };
      app.service("account-funding").create(funding);
      app.service("transactions-history").create(fundingHistory);
    }
    return context;
  };

  ////////////////////////////
};
const getTotalAmountSpent = async (userId, transactions_historyModel) => {
  // const sequelize = this.app.get("sequelizeClient");

  // const { transactions_history } = sequelize.models;
  // const sequelize = this.Model.sequelize;
  const result = await transactions_historyModel.sum("amountPaid", {
    where: { userId },
  });

  return result || 0;
};
const transformFinalizeAccountFundingData = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { users, transactions_history } = sequelize.models;

    const { amount } = data;
    let additionalOrderDetails = {
      amountToPay: amount,
      paymentMethod: "wallet",
    };
    context.data = { ...context.data, ...additionalOrderDetails };

    return context;
  };
};
module.exports = {
  FundUserAccount,
  ReserveBankAccount,
  KeepFundingHistory,
  KeepPaymentHistory,
  getUserAccountBalanceInfo,
  generateWalletId,
  generateReferLink,
  validateReferByLink,
  creditUserAccount,
  getTotalAmountSpent,
  transformFinalizeAccountFundingData,
};
