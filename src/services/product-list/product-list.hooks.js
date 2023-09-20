const {
  checkForExistingValues,
  checkIfNotExisting,
  SendGeneralResponse,
} = require("../../hooks/general-uses");
const { validateAddProductListInput } = require("../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      validateAddProductListInput(),
      checkIfNotExisting({
        fieldsToCheck: [
          { fieldName: "id", value: "providerId", friendlyName: "Provider id" },

          // Add more fields to check as needed
        ],
        serviceType: "providers",
      }),
      checkForExistingValues({
        fieldsToCheck: [
          { fieldName: "productName", friendlyName: "product Name" },
          { fieldName: "slug", friendlyName: "slug Name" },

          // Add more fields to check as needed
        ],
        serviceType: "product-list",
      }),
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
      SendGeneralResponse({ message: "New Product Added Successfully" }),
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
