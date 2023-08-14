const { CONSTANT } = require("../../../dependency/Config");
const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  validateBuyElectricityUserInput,
} = require("../../../hooks/rule.validator");
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

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      validateBuyElectricityUserInput(),
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
      // SendGeneralResponse({
      //   message: CONSTANT.successMessage.electricityPurchase,
      // }),
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
