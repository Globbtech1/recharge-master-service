const { BadRequest } = require("@feathersjs/errors");
const sendScheduledNotification = require("../../../jobs/pushNotification/push-notification-scheduler");
const {
  errorMessage,
  successMessage,
} = require("../../dependency/UtilityFunctions");
const { MonifyIntegration } = require("../../interfaces/monifyIntegration");
const logger = require("../../logger");

/* eslint-disable no-unused-vars */
const BaxiIntegration =
  require("../../interfaces/baxiIntegration").BaxiIntegration;

exports.Testing = class Testing {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    try {
      // const Baxi = new BaxiIntegration("BaxiIntegration", "info");
      // let airtimeProviders = await Baxi.airTimeProviders();
      // console.log(airtimeProviders);
      // return Promise.resolve(
      //   successMessage(
      //     airtimeProviders,
      //     "Aitime providers retrieved successfully"
      //   )
      // );
      sendScheduledNotification(
        "iuriruruurrurrrur878983938jijrrirriurirurururiu893839838393839839",
        {
          title: "Hello!",
          body: "This is a test push notification",
        }
      );
      return;
    } catch (error) {
      logger.error("error", error);
      return Promise.reject(
        new BadRequest("unable to retrieve airtime Providers")
      );
    }
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const sequelize = this.app.get("sequelizeClient");
    const { generateaccount } = sequelize.models;

    const Monnify = new MonifyIntegration();
    let dataPay = {
      userId: 1,
      accountName: "Jinadi Samuel",
      customerEmail: "Jinadisamuel@gmail.com",
      bankCode: "035",
    };
    
    let resp = await Monnify.reserveAccountNumber(dataPay);
    let accountDetailsArray = resp.accounts;
    let accountReference = resp.accountReference;
    let accountDetails = {};
    if (accountDetailsArray.length > 0) {
      accountDetails = accountDetailsArray[0];
      console.log(accountDetails, "accountDetails");
      generateaccount.create({
        userId: 1,
        bankName: accountDetails?.bankName,
        accountNumber: accountDetails?.accountNumber,
        accountReference: accountReference,
        otherDetails: resp,
      });
    }

    console.log(JSON.stringify(resp));
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    console.log(params, "params");
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
