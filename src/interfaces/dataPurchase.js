const { handleAPICall } = require("../dependency/apiServices");
const { CONSTANT } = require("../dependency/Config");
const {
  convertToNaira,
  getProviderSourceImage,
  convertToKobo,
  getProviderCashBack,
} = require("../dependency/UtilityFunctions");
const { pushSlackNotification } = require("../hooks/general-uses");

exports.DataPurchase = class DataPurchase {
  constructor() {
    // this.name = name;
    // this.level = level;
  }

  getProviderList = (paymentProviders, PaymentId) =>
    new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {};
      let endpoint = `${process.env.BillingURl}/v1/databundle/providers`;
      handleAPICall(endpoint, "GET", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            let reformattedResponse = ResponseData.map((item) => {
              let shortName = item.shortname;
              let provider = item.service_type;
              let providerDetails = getProviderSourceImage(
                paymentProviders,
                provider
              );
              let providerImage = providerDetails?.image || "";
              let ProviderCashBack = getProviderCashBack(
                paymentProviders,
                provider,
                PaymentId
              );
              console.log(ProviderCashBack, "ProviderCashBack");
              let providerCashBack = ProviderCashBack?.cashBackPercentage || 0;
              return {
                provider: provider,
                shortname: shortName,

                name: item.name,
                image: providerImage,
                cashBackPercentage: providerCashBack,
                //   plan: ["prepaid"],
              };
            });
            resolve(reformattedResponse);
          } else {
            reject(new Error(CONSTANT.externalRequestFailErrorMessage));
          }
        })
        .catch((error) => {
          console.log(
            ".............................................................start"
          );

          // console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });
  getBundleListList = (provider) =>
    new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {};
      let endpoint = `${process.env.BillingURl}/v1/databundle/plans/${provider}`;
      handleAPICall(endpoint, "GET", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            let reformattedResponse = ResponseData.map((item) => {
              let bundleName = item.name;
              let price = convertToKobo(item.price);
              let dataCode = item.datacode;
              let validity = item.validity;
              let allowance = item.allowance;
              let PriceIn = "Kobo";

              return {
                name: bundleName,
                price: price,
                datacode: dataCode,
                validity: validity,
                allowance: allowance,
                PriceIn,
              };
            });
            resolve(reformattedResponse);
          } else {
            reject(new Error(CONSTANT.externalRequestFailErrorMessage));
          }
        })
        .catch((error) => {
          console.log(
            ".............................................................start"
          );

          // console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });
  buyDataPlans = (payload) =>
    new Promise(async (resolve, reject) => {
      // let userAmount = data?.amount;
      // let amountInNaira = convertToNaira(userAmount);
      // const { phoneNumber, provider, dataCode } = data;
      let AccessToken = "ResponseData.accessToken";
      // let payload = {
      //   phone: phoneNumber,
      //   amount: amountInNaira,
      //   service_type: provider,
      //   datacode: dataCode,
      // };
      console.log(payload, "payloadpayloadpayloadpayload");
      let endpoint = `${process.env.BillingURl}/v1/databundle`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            resolve(ResponseData);
          } else {
            let ResponseData = response?.data;
            JSON.stringify(ResponseData, "errorResponse");
            reject(new Error(CONSTANT.externalRequestFailErrorMessage));
          }
        })
        .catch((error) => {
          let errorResponse = error?.response?.data?.error;
          pushSlackNotification(errorResponse, "warn");

          console.log(
            ".............................................................start"
          );

          console.log(errorResponse, "opppppppoop");
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });
};
