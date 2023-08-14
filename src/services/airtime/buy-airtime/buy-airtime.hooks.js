const { CONSTANT } = require("../../../dependency/Config");
const {
  checkAvailableBalance,
  validateMobileNumber,
  debitUserAccount,
  recordUserCashBack,
  recordQuickBeneficiary,
  validateTransactionPin,
} = require("../../../hooks/billPayment.hook");
const {
  SendGeneralResponse,
  sendSlackNotification,
} = require("../../../hooks/general-uses");
const {
  validateBuyAirtimeUserInput,
} = require("../../../hooks/rule.validator");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      // getAllProviders(),
      validateBuyAirtimeUserInput(),
      validateMobileNumber(),
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
      recordUserCashBack(),
      recordQuickBeneficiary(),
      sendSlackNotification(),
      SendGeneralResponse({ message: CONSTANT.successMessage.airtimePurchase }),
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
