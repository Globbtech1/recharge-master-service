const { CONSTANT } = require("../../../dependency/Config");
const {
  checkAvailableBalance,
  validateMobileNumber,
  debitUserAccount,
  recordUserCashBack,
  recordQuickBeneficiary,
  validateTransactionPin,
  scheduleUserPayment,
} = require("../../../hooks/billPayment.hook");
const {
  SendGeneralResponse,
  sendSlackNotification,
  checkIfNotExisting,
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
      checkIfNotExisting({
        fieldsToCheck: [
          { fieldName: "id", value: "productId", friendlyName: "Product id" },

          // Add more fields to check as needed
        ],
        serviceType: "product-list",
      }),

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
      // recordUserCashBack(),
      recordQuickBeneficiary(),
      // sendSlackNotification(),
      scheduleUserPayment(),
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
