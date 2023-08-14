const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  default: hashPassword,
} = require("@feathersjs/authentication-local/lib/hooks/hash-password");
const { setField } = require("feathers-authentication-hooks");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      hashPassword("password"),
      authenticate("jwt"),
      setField({
        from: "params.user.id",
        as: "params.query.id",
      }),
    ],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
