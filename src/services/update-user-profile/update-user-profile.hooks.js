const { authenticate } = require("@feathersjs/authentication").hooks;
// const {
//   default: hashPassword,
// } = require("@feathersjs/authentication-local/lib/hooks/hash-password");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
const { setField } = require("feathers-authentication-hooks");
module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      authenticate("jwt"),
      hashPassword("password"),
      setField({
        from: "params.user.id",
        as: "params.query.id",
      }),
    ],
    remove: [],
  },

  after: {
    all: [protect("id")],
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
