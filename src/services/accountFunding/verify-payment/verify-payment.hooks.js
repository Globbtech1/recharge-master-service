const { SendGeneralResponse } = require("../../../hooks/general-uses");
const {
  KeepFundingHistory,
  KeepPaymentHistory,
} = require("../../../hooks/userFund.hook");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [
      KeepFundingHistory(),
      KeepPaymentHistory(),
      SendGeneralResponse({ message: "Account Funded Successfully" }),
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
