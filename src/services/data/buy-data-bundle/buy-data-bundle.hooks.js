const { CONSTANT } = require("../../../dependency/Config");
const {
  validateMobileNumber,
  checkAvailableBalance,
  validateTransactionPin,
  debitUserAccount,
  recordUserCashBack,
  recordQuickBeneficiary,
  scheduleUserPayment,
  addToFavoriteRecharge,
  sendResultBackToFrontEnd,
} = require("../../../hooks/billPayment.hook");
const {
  sendSlackNotification,
  SendGeneralResponse,
  checkIfNotExisting,
} = require("../../../hooks/general-uses");
const { validateBuyDataUserInput } = require("../../../hooks/rule.validator");
const { validateCouponCode } = require("../../../hooks/userManagement.hook");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      validateBuyDataUserInput(),
      checkIfNotExisting({
        fieldsToCheck: [
          { fieldName: "id", value: "productId", friendlyName: "Product id" },

          // Add more fields to check as needed
        ],
        serviceType: "product-list",
      }),

      validateMobileNumber(),
      validateCouponCode(),
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
      addToFavoriteRecharge(),
      scheduleUserPayment(),
      sendResultBackToFrontEnd({
        message: CONSTANT.successMessage.dataPurchase,
      }),
      // SendGeneralResponse({ message: CONSTANT.successMessage.dataPurchase }),
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
