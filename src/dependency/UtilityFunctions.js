const bcrypt = require("bcrypt");
const { CONSTANT } = require("./Config");
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
  let response = { success: false, data: data, message: message };
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
};
