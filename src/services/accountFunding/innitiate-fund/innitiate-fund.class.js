const { BadRequest } = require("@feathersjs/errors");
const { CONSTANT } = require("../../../dependency/Config");
const {
  convertToNaira,
  ShowCurrentDate,
  successMessage,
} = require("../../../dependency/UtilityFunctions");
// const { MonifyIntegration } = require("../../../interfaces/monifyIntegration");
const { PaystackService } = require("../../../interfaces/payStackIntegration"); // Replace with the correct path

/* eslint-disable no-unused-vars */
exports.InnitiateFund = class InnitiateFund {
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
    console.log(data, "please,,,,,,,,,,,,,,,,,,,,");
    let loggedInUser = params.user.id;

    const sequelize = this.app.get("sequelizeClient");
    const { users, initiate_reset_pwd, payment_list } = sequelize.models;
    const {
      // fullName,
      userEmail,
      // phoneNumber,
      // userDonationId,
      amount,
      // currency,
      referenceNumber,
      payData,
    } = data;
    // let loggedInUserId = params?.user?.id;

    try {
      let UserData2Save = {
        userId: loggedInUser,
        amount: amount,
        reference: referenceNumber,
        paymentData: JSON.stringify(payData),
        status: CONSTANT.transactionStatus.pending,
      };
      console.log(UserData2Save, "UserData2Save");
      this.app.service("accountFunding/fund-innitiator").create(UserData2Save);

      let responseData = {
        paymentLink: payData?.authorization_url,
      };
      const resp = successMessage({
        ...responseData,
        message: "Payment Initialized Successfully",
      });

      return resp;
    } catch (error) {
      let errorMessage =
        error?.response?.data?.error?.message ||
        "Unable to process your request";
      console.error("An error occurred: ", error.message);
      return Promise.reject(
        new BadRequest(
          errorMessage ||
            "Payment can not be initialize at the moment , please try again."
        )
      );
    }
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
