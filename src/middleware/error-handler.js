const Sentry = require("@sentry/node");
// function sentryErrorHandler(err, req, res, next) {
//   console.log("enter middle whareee");
//   //   console.log(err, "errerrerrerrerr");
//   // Capture and report the error to Sentry
//   Sentry.captureException(err);

//   // Handle the error and send an appropriate response
//   //   res.status(err.code || 500).json({ error: err.message });
// }

function sentryErrorHandler() {
  console.log("enter middle whareee");
  return function (err, req, res, next) {
    // console.log(err, "err.........");
    // console.log("enter middle whareee????");
    Sentry.captureException(err);
    res.status(err.code || 500).json({ error: err.message });
  };
}

module.exports = sentryErrorHandler;
// module.exports = function () {
//   // Return the middleware function
//   return sentryErrorHandler;
// };
