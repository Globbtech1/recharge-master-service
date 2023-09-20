const bcrypt = require("bcrypt");
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
};
