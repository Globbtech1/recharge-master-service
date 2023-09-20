const { CONSTANT } = require("../../../dependency/Config");
const {
  validateMobileNumber,
  checkAvailableBalance,
  validateTransactionPin,
  debitUserAccount,
  recordUserCashBack,
  recordQuickBeneficiary,
} = require("../../../hooks/billPayment.hook");
const {
  sendSlackNotification,
  SendGeneralResponse,
} = require("../../../hooks/general-uses");
const { validateBuyDataUserInput } = require("../../../hooks/rule.validator");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      validateBuyDataUserInput(),
      validateMobileNumber(),
      checkAvailableBalance(),
      // validateTransactionPin(),
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
      SendGeneralResponse({ message: CONSTANT.successMessage.dataPurchase }),
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
