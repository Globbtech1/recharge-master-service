const { CONSTANT } = require("../../../dependency/Config");
const {
  checkAvailableBalance,
  validateTransactionPin,
  debitUserAccount,
} = require("../../../hooks/billPayment.hook");
const { SendGeneralResponse } = require("../../../hooks/general-uses");
const {
  creditUserAccount,
  transformFinalizeAccountFundingData,
} = require("../../../hooks/userFund.hook");
const { checkForAccountStatus } = require("../../../hooks/userManagement.hook");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      checkForAccountStatus(),
      transformFinalizeAccountFundingData(),
      checkAvailableBalance(),
      validateTransactionPin(),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      debitUserAccount(),
      creditUserAccount(),
      SendGeneralResponse({ message: CONSTANT.successMessage.transferFund }),
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
