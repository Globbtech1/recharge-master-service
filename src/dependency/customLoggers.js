const winston = require("winston");
require("winston-loggly-bulk");

const customFormatter = winston.format((info) => {
  if (info.message instanceof Object && !Array.isArray(info.message)) {
    return info; // Use json format for objects
  }

  // For non-objects, format the message as a string
  info.message = info.message.toString();
  return info;
});

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     customFormatter(), // Use the custom formatter
//     winston.format.simple() // Optionally, add a simple format as well
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "combined.log" }),
//   ],
// });
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Loggly({
      token: "ab9b5105-ac11-4eed-9a6f-f7508606eb28",
      subdomain: "rmaster",
      tags: ["Winston-NodeJS"],
      json: true,
    }),
  ],
});

const customLog = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    args.forEach((arg) => {
      logger.info(arg);
    });
    console.log("From Custom logger");
  }
};

module.exports = {
  customLog,
};
