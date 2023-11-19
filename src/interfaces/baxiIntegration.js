const {
  getBaxiAuthHeader,
  generateTransactionReference,
} = require("../dependency/UtilityFunctions");
const { handleAPICall } = require("../dependency/apiServices");
const { customLog } = require("../dependency/customLoggers");

exports.BaxiIntegration = class BaxiIntegration {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }

  // Adding a method to the constructor
  greet() {
    return `${this.name} says hello.`;
  }

  airTimeProviders = () =>
    new Promise((resolve, reject) => {
      let payload = {};
      let endpoint = `${process.env.BAXI_BASE_URL}/services/airtime/providers`;
      let httpMethod = "get";
      let apiToken = getBaxiAuthHeader(httpMethod, endpoint, payload);
      let token = apiToken;
      handleAPICall(endpoint, httpMethod, "baxiapi", token, payload)
        .then((res) => {
          customLog(res.data, "<<<<<<<<<<<>>>>>>>");
          let ResponseData = res.data?.data?.providers;
          // let reformattedResponse = ResponseData.map((item) => {
          //   let shortName = item.shortname;
          //   // return {
          //   //   provider: item.service_type,
          //   //   shortname: shortName,
          //   //   name: item.name,
          //   //   image: `https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/${shortName}.png`,
          //   // };
          // });
          resolve(ResponseData);
        })
        .catch((error) => {
          customLog(error);
          reject(error);
        });
    });

  buyAirtime = (data) =>
    new Promise((resolve, reject) => {
      let payload = {
        ...data,
        agentId: process.env.BAXI_AGENT_ID,
        agentReference: generateTransactionReference(),
        plan: "prepaid",
      };
      customLog(payload, "payload");
      let endpoint = `${process.env.BAXI_BASE_URL}/services/airtime/request`;
      let httpMethod = "POST";
      let apiToken = getBaxiAuthHeader(httpMethod, endpoint, payload);
      let token = apiToken;
      handleAPICall(endpoint, httpMethod, "baxiapi", token, payload)
        .then((res) => {
          customLog(res.data, "<<<<<<<<<<<>>>>>>>");
          let responseData = res.data?.data;
          customLog(responseData, "responseData");
          // Check the status code to determine the success of the transaction
          if (
            responseData.statusCode === "0" &&
            responseData.transactionStatus === "success"
          ) {
            // Transaction was successful
            customLog(
              "Transaction successful:",
              responseData.transactionMessage
            );
            let resp = {
              ...responseData,
              status: responseData?.transactionStatus,
            };
            resolve(resp);
          } else {
            // Transaction failed
            customLog("Transaction failed:", responseData.transactionMessage);
            reject(responseData);
          }
        })
        .catch((error) => {
          customLog(error);
          reject(error);
        });
    });
  buyDataPlans = (data) =>
    new Promise((resolve, reject) => {
      let payload = {
        ...data,
        agentId: process.env.BAXI_AGENT_ID,
        agentReference: generateTransactionReference(),
        // plan: "prepaid",
      };
      customLog(payload, "payload");
      let endpoint = `${process.env.BAXI_BASE_URL}/services/databundle/request`;
      let httpMethod = "POST";
      let apiToken = getBaxiAuthHeader(httpMethod, endpoint, payload);
      let token = apiToken;
      handleAPICall(endpoint, httpMethod, "baxiapi", token, payload)
        .then((res) => {
          customLog(res.data, "<<<<<<<<<<<>>>>>>>");
          let responseData = res.data?.data;
          customLog(responseData, "responseData");
          // Check the status code to determine the success of the transaction
          if (
            responseData.statusCode === "0" &&
            responseData.transactionStatus === "success"
          ) {
            // Transaction was successful
            customLog(
              "Transaction successful:",
              responseData.transactionMessage
            );
            let resp = {
              ...responseData,
              status: responseData?.transactionStatus,
            };
            resolve(resp);
          } else {
            // Transaction failed
            customLog("Transaction failed:", responseData.transactionMessage);
            reject(responseData);
          }
        })
        .catch((error) => {
          customLog(error);
          reject(error);
        });
    });
  getBundleListList = (provider) =>
    new Promise((resolve, reject) => {
      let payload = {
        service_type: provider,
      };
      customLog(payload, "payload");
      let endpoint = `${process.env.BAXI_BASE_URL}/services/databundle/bundles`;
      let httpMethod = "POST";
      let apiToken = getBaxiAuthHeader(httpMethod, endpoint, payload);
      let token = apiToken;
      handleAPICall(endpoint, httpMethod, "baxiapi", token, payload)
        .then((res) => {
          let responseData = res.data;
          if (responseData.code === 200) {
            let resp = responseData?.data;
            resolve(resp);
          } else {
            reject(responseData);
          }
        })
        .catch((error) => {
          customLog(error);
          reject(error);
        });
    });
};
