/* eslint-disable no-unused-vars */
const { NotFound, BadRequest } = require("@feathersjs/errors");
const logger = require("../../../logger");
const {
  successMessage,
  convertToNaira,
  ShowCurrentDate,
  generateRandomString,
} = require("../../../dependency/UtilityFunctions");
const { CONSTANT } = require("../../../dependency/Config");

exports.FinalizeRequest = class FinalizeRequest {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const { user } = params;
    const { walletId, amount, transactionPin } = data;
    logger.info("data", user);
    const loggedInUserId = user?.id;
    const sequelize = this.app.get("sequelizeClient");
    if (!walletId || walletId === "") {
      // Promise.reject(new BadRequest("Enter user wallet Id "));
      throw new BadRequest(`Enter user wallet Id`);
    }
    const { users, account_balance } = sequelize.models;
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

      const account_balanceDetails = await account_balance.findOne({
        where: {
          deletedAt: null,
          userId: receiverAccountId,
        },
      });
      let dataResponse = {};
      if (account_balanceDetails !== null) {
        availableBalance = account_balanceDetails?.balance;
        let currentBalance = parseFloat(availableBalance) + parseFloat(amount);

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
          paymentListId: 0, //TODO change to wallet transfer id  // paymentId
          transactionDate: ShowCurrentDate(),
          amount: convertToNaira(amount),
          transactionStatus: CONSTANT.transactionStatus.success,
          paidBy: "self",
        };
        let responseTransaction = await this.app
          .service("transactions-history")
          .create(transactionHistory);
      }

      // return Promise.resolve(
      //   successMessage(
      //     dataResponse,
      //     "Enter transaction pin to confirm transfer"
      //   )
      // );
      return dataResponse;
    } catch (error) {
      logger.error("error", error);

      throw new Error(
        `An error Occurred while trying to initiate fund transfer`
      );
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
