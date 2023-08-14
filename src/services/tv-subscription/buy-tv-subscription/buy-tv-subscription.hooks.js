const { CONSTANT } = require("../../../dependency/Config");
const {
  debitUserAccount,
  recordUserCashBack,
  recordQuickBeneficiary,
  checkAvailableBalance,
  validateTransactionPin,
} = require("../../../hooks/billPayment.hook");
const { sendSlackNotification, SendGeneralResponse } = require("../../../hooks/general-uses");
const { tvSubValidationInput } = require("../../../hooks/rule.validator");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      tvSubValidationInput(),
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
      // SendGeneralResponse({ message: CONSTANT.successMessage.tvSubscriptionPurchase }),
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
