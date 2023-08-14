const { SendGeneralResponse } = require("../../../hooks/general-uses");
const {
  KeepFundingHistory,
  KeepPaymentHistory,
} = require("../../../hooks/userFund.hook");

module.exports = {
  before: {
    all: [],
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
    get: [],

    create: [
      KeepFundingHistory(),
      KeepPaymentHistory(),
      SendGeneralResponse({ message: "Account Funded Successfully" }),
    ],
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
