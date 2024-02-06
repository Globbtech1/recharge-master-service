const bcrypt = require("bcrypt");
const { CONSTANT } = require("./Config");
const moment = require("moment");
const CryptoJS = require("crypto-js");

const successMessage = (data, message = "") => {
  let reponse = { success: true, data: data, message: message };
  return reponse;
};
const errorMessage = (message = "", reason = "", statusCode = 400) => {
  let reponse = {
    name: "GeneralError",
    message: message,
    code: statusCode,
    className: "general-error",
    data: {},
    errors: reason,
  };
  return reponse;
  // throw new Error(message);
};
const errorMessageV2 = (message = "", data = null) => {
  let response = { success: false, message: message, data: data };
  return response;
};

const handleError = (error) => {
  let message;
  let defaultMessage = "Something went wrong, try again please.";
  if (error.response) {
    if (error.response.status === 403)
      message = "You do not have the required permission";
    else if ((error.response.status >= 500) & (error.response.status < 600)) {
      message = defaultMessage;
    } else {
      message =
        error.response.data.error ||
        error.response.data.message ||
        error.response.data.Message ||
        error.response.data.title ||
        defaultMessage;
    }
  } else if (error.request) {
    message = error.message;
  } else {
    message = error.message;
  }
  return message;
};
const ShowCurrentDate = () => {
  let date = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  if (date < 10) {
    date = `0${date}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  let currentdate = year + "-" + month + "-" + date;
  return currentdate;
};
const generateRandomNumber = async (
  table,
  field,
  length = 10,
  alphaNumeric = true
) =>
  new Promise(async (resolve, reject) => {
    try {
      // const givenSet =
      // "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      // const givenSet = "0123456789";
      if (!alphaNumeric) {
        resolve("123456");
      }
      const givenSet = alphaNumeric
        ? "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        : "0123456789";

      let code = "";
      for (let i = 0; i < length; i++) {
        let pos = Math.floor(Math.random() * givenSet.length);
        code += givenSet[pos];
      }
      if (table) {
        const resp = await table.findOne({
          where: {
            [field]: code,
            // status: 1,
            deletedAt: null,
          },
        });
        if (resp) {
          generateRandomNumber();
        } else {
          resolve(code);
        }
      } else {
        resolve(code);
      }
    } catch (error) {
      console.log(error, "error");
      resolve("<>");
    }
  });
const generateRandomString = async (table, field, length = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const givenSet =
        "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      // const givenSet = "0123456789";

      let code = "";
      for (let i = 0; i < length; i++) {
        let pos = Math.floor(Math.random() * givenSet.length);
        code += givenSet[pos];
      }
      if (table) {
        const resp = await table.findOne({
          where: {
            [field]: code,
            // status: 1,
            deletedAt: null,
          },
        });
        if (resp) {
          generateRandomString();
        } else {
          resolve(code);
        }
      } else {
        resolve(code);
      }
    } catch (error) {
      console.log(error, "Can not generate refrence error");
      resolve("<>");
    }
  });
const hashData = async (plaintextValue) => {
  const hash = await bcrypt.hash(plaintextValue, 10);
  return hash;
};
const compareHashData = async (plaintextValue, hash) => {
  const result = await bcrypt.compare(plaintextValue, hash);
  return result;
};
const systemConfig = {
  maxVirtualAccount: 2,
  maxCardAllowed: 3,
};
const convertToKobo = (amount) => {
  let convertedAmount = amount * 100;
  return convertedAmount;
};
const convertToNaira = (amount) => {
  let convertedAmount = amount / 100;
  return convertedAmount;
};

const getProviderSourceImage = (paymentProviders, name) => {
  const filteredObjects = paymentProviders?.filter(
    (object) => object.provider === name
  );
  return filteredObjects.length > 0 ? filteredObjects[0] : {};
};
const getProviderCashBack = (paymentProviders, providerName, productId) => {
  const filteredObjects = paymentProviders?.filter(
    (object) => object.provider == providerName && object.productId == productId
  );
  //console.log(filteredObjects, "filteredObjectsfilteredObjects");
  return filteredObjects.length > 0 ? filteredObjects[0] : {};
};
const getCurrentMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth;
};
const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear;
};
const successResp = (data, message = "") => {
  let reponse = { success: true, data: data, message: message };
  return reponse;
};
const failedResp = (message = "") => {
  let reponse = { success: false, message: message, name: "myCustomError" };
  return reponse;
};
const removeSensitiveKeys = (data, keysToRemove) => {
  const newData = { ...data }; // Create a copy of the original object

  keysToRemove.forEach((key) => {
    delete newData[key]; // Delete the specified key from the copied object
  });

  return newData; // Return the modified object
};
const calculateBillNextExecutionDate = (scheduledPayment) => {
  const { frequency, dayOfWeekString, dayOfMonth, lastExecution } =
    scheduledPayment;
  let nextExecution;
  const dayOfWeek = getDayOfWeek(dayOfWeekString);
  // Convert the lastExecution date to a JavaScript Date object
  const lastExecutionDate = lastExecution ? new Date(lastExecution) : null;

  if (frequency === CONSTANT.scheduleFrequency.daily) {
    console.log("enter daily");
    if (!lastExecutionDate) {
      // If it's the first execution, set the nextExecution to today
      nextExecution = new Date();
      const currentDate = new Date();
      nextExecution.setDate(nextExecution.getDate() + 1); // Add one day to the current date
      nextExecution.setHours(currentDate.getHours());
      nextExecution.setMinutes(currentDate.getMinutes());
    } else {
      // If it's not the first execution, add one day to the lastExecution date
      nextExecution = new Date(lastExecutionDate);
      nextExecution.setDate(lastExecutionDate.getDate() + 1);
    }
  } else if (frequency === CONSTANT.scheduleFrequency.weekly) {
    console.log("enter weekly");

    if (!lastExecutionDate) {
      // If it's the first execution, set the nextExecution to the next specified day of the week
      nextExecution = new Date();
      const currentDate = new Date();
      if (currentDate.getDay() === dayOfWeek) {
        // If today is the same as the specified day, add 7 days to go to next week
        nextExecution.setDate(currentDate.getDate() + 7);
      }
      nextExecution.setHours(currentDate.getHours());
      nextExecution.setMinutes(currentDate.getMinutes());
      nextExecution.setDate(
        nextExecution.getDate() + ((dayOfWeek - nextExecution.getDay() + 7) % 7)
      );
    } else {
      // If it's not the first execution, add one week to the lastExecution date
      nextExecution = new Date(lastExecutionDate);
      nextExecution.setDate(
        lastExecutionDate.getDate() +
          ((dayOfWeek - lastExecutionDate.getDay() + 7) % 7) +
          7
      );
    }
  } else if (frequency === CONSTANT.scheduleFrequency.monthly) {
    console.log("enter monthly");

    if (!lastExecutionDate) {
      // If it's the first execution, set the nextExecution to the specified day of the month
      nextExecution = new Date();
      const currentDate = new Date();
      nextExecution.setMonth(currentDate.getMonth() + 1);
      nextExecution.setHours(currentDate.getHours());
      nextExecution.setMinutes(currentDate.getMinutes());
      nextExecution.setDate(dayOfMonth);
    } else {
      // If it's not the first execution, add one month to the lastExecution date
      nextExecution = new Date(lastExecutionDate);
      nextExecution.setMonth(lastExecutionDate.getMonth() + 1);
      nextExecution.setDate(dayOfMonth);
    }
  }

  return nextExecution;
};
const getDayOfWeek = (dayName) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const index = daysOfWeek.indexOf(dayName);

  if (index !== -1) {
    return index;
  } else {
    // Handle invalid day names here, e.g., return -1 or throw an error
    return -1; // -1 indicates an invalid day name
  }
};
const formatAmount = (amount, toWholeNumber = false) => {
  const currency = "\u20A6";
  // const currency = '$';

  if (toWholeNumber) {
    const value = Math.round(Number(amount));
    return currency + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  let formattedAmount = (+amount || 0).toFixed(2).toString();
  if (!formattedAmount.includes(".")) {
    formattedAmount = `${amount}.00`;
  }
  formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return currency + formattedAmount;
};
const capitalizeFirstLetter = (string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};
const getBaxiAuthHeader = (httpMethod, requestUrl, requestBody) => {
  const CLIENT_KEY = "baxi_capricorn";
  const SECRET_KEY = "usertest1a";

  let requestPath = requestUrl;
  if (httpMethod === "GET") {
    requestBody = "";
  } else {
    requestBody = JSON.stringify(requestBody);
  }

  let hashedPayload;
  if (requestBody) {
    hashedPayload = CryptoJS.SHA256(requestBody).toString(CryptoJS.enc.Base64);
  } else {
    hashedPayload = "";
  }

  const currentTime = new Date().toUTCString();

  const timestamp = moment(currentTime).unix();
  const requestData = httpMethod + requestPath + timestamp + hashedPayload;

  const hmacDigest = CryptoJS.HmacSHA1(requestData, SECRET_KEY);

  const authHeader =
    "Baxi " + CLIENT_KEY + ":" + hmacDigest.toString(CryptoJS.enc.Base64);

  // Assuming you want to set the x-msp-date environment variable
  // postman.setEnvironmentVariable('x-msp-date', currentTime);

  console.log(requestUrl); // This line is for debugging purposes

  return authHeader;
};
const generateTransactionReference = () => {
  const constantPart = "ash_";
  const randomPart = Math.floor(Math.random() * 1000000); // You can adjust the range as needed
  const timestampPart = new Date().getTime();

  const transactionReference = constantPart + randomPart + "_" + timestampPart;
  return transactionReference;
};
const normalizePhoneNumber = (phoneNumber) => {
  // Remove leading zero, +234, or 234
  const normalizedNumber = phoneNumber.replace(/^0|^(\+?234)|^234/, "");

  return normalizedNumber;
};
const replaceVariablesInSentence = (message, variables) => {
  return message.replace(
    /%\w+%/g,
    (match) => variables[match.slice(1, -1)] || match
  );
};
const maskSensitiveData = (data, type) => {
  if (type === "phone") {
    // Assuming a standard 10-digit phone number
    return data.slice(0, -4).replace(/\d/g, "*") + data.slice(-4);
  } else if (type === "email") {
    const [username, domain] = data.split("@");
    const maskedUsername =
      username.slice(0, -Math.floor(username.length / 2)).replace(/./g, "*") +
      username.slice(-Math.floor(username.length / 2));
    return maskedUsername + "@" + domain;
  } else {
    // Handle other types or throw an error
    throw new Error("Unsupported data type for masking");
  }
};
const determineUserType = (userType) => {
  switch (userType) {
    case "verified":
      return { isPhoneNumberVerify: true };
    case "nonVerified":
      return { isPhoneNumberVerify: false };
    case "all":
      return {};
    default:
      return { userType: "Teacher" };
  }
};
// // Example usage:
// const originalPhoneNumber = "1234567890";
// const maskedPhoneNumber = maskSensitiveData(originalPhoneNumber, "phone");
// console.log(maskedPhoneNumber);

// const originalEmail = "example@example.com";
// const maskedEmail = maskSensitiveData(originalEmail, "email");
// console.log(maskedEmail);

module.exports = {
  successMessage,
  errorMessage,
  handleError,
  ShowCurrentDate,
  generateRandomNumber,
  hashData,
  compareHashData,
  generateRandomString,
  systemConfig,
  convertToKobo,
  convertToNaira,
  getProviderSourceImage,
  getProviderCashBack,
  getCurrentMonth,
  getCurrentYear,
  errorMessageV2,
  successResp,
  failedResp,
  removeSensitiveKeys,
  calculateBillNextExecutionDate,
  formatAmount,
  capitalizeFirstLetter,
  getBaxiAuthHeader,
  generateTransactionReference,
  normalizePhoneNumber,
  replaceVariablesInSentence,
  maskSensitiveData,
  determineUserType,
};
