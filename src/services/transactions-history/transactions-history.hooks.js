const PushNotificationService = require("../../../jobs/pushNotification/push-notification-service");
const { includeBillDetails } = require("../../hooks/billPayment.hook");
const { sendTransactionEmail } = require("../../hooks/general-uses");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [includeBillDetails()],
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
    // create: [sendTransactionEmail()],
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
