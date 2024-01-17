/* eslint-disable no-unused-vars */
const { NotFound, BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const {
  successMessage,
  convertToNaira,
  ShowCurrentDate,
  generateRandomString,
  replaceVariablesInSentence,
  formatAmount,
} = require("../../../dependency/UtilityFunctions");
const { CONSTANT } = require("../../../dependency/Config");

exports.FinalizeRequest = class FinalizeRequest {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async create(data, params) {
    const { user } = params;
    let paidByPhoneNumber = user?.phoneNumber;

    const { walletId, amount, transactionPin, platform = "auto" } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (!walletId || walletId === "") {
      // Promise.reject(new BadRequest("Enter user wallet Id "));
      throw new BadRequest(`Enter user wallet Id`);
    }
    const { users, account_balance, product_list } = sequelize.models;
    try {
      const userWalletDetails = await users.findOne({
        where: {
          deletedAt: null,
          walletId: walletId,
        },
      });
      if (userWalletDetails === null) {
        const notFound = new NotFound(
          "You have entered an invalid wallet id. please check and try again "
        );
        return Promise.reject(notFound);
      }
      let receiverAccountId = userWalletDetails?.id;
      let receiverName = userWalletDetails?.fullName;
      let availableBalance = 0;

      if (receiverAccountId === loggedInUserId) {
        const notFound = new BadRequest("You can not transfer to self wallet");
        return Promise.reject(notFound);
      }
      const product_listDetails = await product_list.findOne({
        where: {
          deletedAt: null,
          // slug: CONSTANT.AccountFunding,
          slug: CONSTANT.WalletTransfer,
        },
      });

      const account_balanceDetails = await account_balance.findOne({
        where: {
          deletedAt: null,
          userId: loggedInUserId,
        },
      });
      let dataResponse = {};
      if (account_balanceDetails !== null) {
        availableBalance = account_balanceDetails?.balance;
        let currentBalance = parseFloat(availableBalance) - parseFloat(amount);

        let transactionReference = await generateRandomString();

        dataResponse = {
          accountName: receiverName,
          transferAmount: amount,
          receiverAccountId,
        };
        let metaData = {
          "Transaction ID": transactionReference,
          "Receiver Wallet id": walletId,
          "Receiver name": receiverName,
          "Paid By": "self",
          Date: ShowCurrentDate(),
          Amount: convertToNaira(amount),
          Status: CONSTANT.transactionStatus.success,
        };
        let transactionHistory = {
          userId: loggedInUserId,
          paymentType: "debit",
          amountBefore: convertToNaira(availableBalance),
          amountAfter: convertToNaira(currentBalance),
          referenceNumber: transactionReference,
          metaData: JSON.stringify(metaData),
          productListId: product_listDetails?.id || 0,
          transactionDate: ShowCurrentDate(),
          amount: convertToNaira(amount),
          transactionStatus: CONSTANT.transactionStatus.success,
          // paidBy: "self",
          paymentMethod: CONSTANT.paymentMethod.wallet,
          amountPaid: convertToNaira(amount),
          // paidBy: fundSource,
          paidBy: paidByPhoneNumber,

          transactionType: CONSTANT.transactionType.walletTransfer,
          platform: platform,
        };
        console.log(transactionHistory, "transactionHistory");
        let responseTransaction = await this.app
          .service("transactions-history")
          .create(transactionHistory);

        ////////////Notification Start/////////////////////
        let stringData = JSON.stringify(metaData);
        const notificationMessage = replaceVariablesInSentence(
          CONSTANT.notificationInfoObject.accountDebit.message,
          {
            TRANSACTION_AMOUNT: formatAmount(convertToNaira(amount)),
          }
        );

        let notificationData = {
          userId: loggedInUserId,
          notificationMessage: notificationMessage,
          data: stringData,
          action: CONSTANT.notificationInfoObject?.accountDebit?.actions,
        };
        await this.app.service("notifications").create(notificationData);
        ////////////Notification End /////////////////////
      }

      return dataResponse;
    } catch (error) {
      console.log(error, "error");
      const cachedError = new Error(
        `An error Occurred while trying to transfer the fund`
      );
      return Promise.reject(cachedError);
    }

    // return data;
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
