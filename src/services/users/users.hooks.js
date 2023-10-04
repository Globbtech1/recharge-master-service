const { authenticate } = require("@feathersjs/authentication").hooks;

const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
// const { VerificationMailBodyContent } = require('../../dependency/templates/templates')

const processUser = require("../../hooks/process-user");

const generateDefaultpassword = require("../../hooks/generate-defaultpassword");

const proccessEmail = require("../../hooks/proccess-email");
const {
  insertIntoVerification,
  SendGeneralResponse,
  checkForExistingValues,
} = require("../../hooks/general-uses");
// const { VerificationMailBodyContent } = require('../../dependency/templates/templates');

// SendEmail(Payloads, Mailbody, "Welcome to Krib- Let’s complete your account setup.");
// SendEmail
const { setField } = require("feathers-authentication-hooks");
const {
  getUserNecessaryInformation,
} = require("../../hooks/userManagement.hook");
const {
  FundUserAccount,
  generateWalletId,
  generateReferLink,
  validateReferByLink,
} = require("../../hooks/userFund.hook");
const { CONSTANT } = require("../../dependency/Config");
module.exports = {
  before: {
    all: [],
    find: [
      authenticate("jwt"),
      // getUserNecessaryInformation()
    ],
    get: [
      authenticate("jwt"),
      // getUserNecessaryInformation()
    ],
    create: [
      processUser(),
      checkForExistingValues({
        fieldsToCheck: [
          { fieldName: "email", friendlyName: "Email" },
          { fieldName: "phoneNumber", friendlyName: "Phone Number" },
          // Add more fields to check as needed
        ],
      }),
      validateReferByLink(),
      hashPassword("password"),
      generateWalletId(),
      generateReferLink(),
    ],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [
      hashPassword("password"),
      authenticate("jwt"),
      // console.log("patch??????"),
      setField({
        from: "params.user.id",
        as: "req.query.id",
      }),
    ],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [],
    get: [],
    create: [
      // insertIntoVerification(),
      FundUserAccount(),
      // proccessEmail({ mailtype: "userCreation" }),
      SendGeneralResponse({
        message: CONSTANT.successMessage.userRegistrationSuccess,
      }),
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
