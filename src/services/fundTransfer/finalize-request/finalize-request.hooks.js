const { CONSTANT } = require("../../../dependency/Config");
const {
  checkAvailableBalance,
  validateTransactionPin,
  debitUserAccount,
} = require("../../../hooks/billPayment.hook");
const { SendGeneralResponse } = require("../../../hooks/general-uses");
const { creditUserAccount } = require("../../../hooks/userFund.hook");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [checkAvailableBalance(), validateTransactionPin()],
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
