const { handleAPICall } = require("../dependency/apiServices");
const {
  convertToNaira,
  getProviderSourceImage,
  getProviderCashBack,
} = require("../dependency/UtilityFunctions");

exports.ElectricityPurchase = class ElectricityPurchase {
  constructor() {}

  getProviders = function (paymentProviders, PaymentId) {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {};
      let endpoint = `${process.env.BillingURl}/v1/nepa/providers`;
      handleAPICall(endpoint, "GET", "bearer", AccessToken, payload)
        .then((res) => {
          let status = res?.status;
          let data = res?.data;
          if (status === 200) {
            let responseData = data?.data;
            let reformattedResponse = responseData.map((item) => {
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
            reject({});
          }
        })
        .catch((error) => {
          console.log(
            ".............................................................start"
          );
          console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });
  };

  verifyMeterNumber = function (data) {
    return new Promise(async (resolve, reject) => {
      const payload = {
        service_type: data?.provider,
        account_number: data?.meterNumber,
      };
      let AccessToken = "ResponseData.accessToken";
      const endPoint = `${process.env.BillingURl}/v1/nepa/verify-meter`;
      handleAPICall(endPoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          let data = res?.data;
          let status = res?.status;
          if (status === 200) {
            let responseData = data?.data;
            resolve(responseData);
          } else {
            reject({});
          }
        })
        .catch((error) => {
          console.log(
            ".............................................................start"
          );

          console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });
  };

  purchaseElectricityUnits = (data) =>
    new Promise(async (resolve, reject) => {
      let userAmount = data?.amount;
      let amountInNaira = convertToNaira(userAmount);
      let AccessToken = "ResponseData.accessToken";
      const payload = {
        service_type: data?.provider,
        account_number: data?.meterNumber,
        amount: amountInNaira,
        phone: data?.phoneNumber,
      };
      const endPoint = `${process.env.BillingURl}/v1/nepa`;
      handleAPICall(endPoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          // console.log(res, "response");
          let status = res?.status;
          let data = res?.data;
          if (status === 200) {
            let responseData = data?.data;
            resolve(responseData);
          } else {
            reject(res);
          }
        })
        .catch((err) => {
          console.log(
            ".............................................................start"
          );

          console.log(err);

          console.log(
            ".............................................................end"
          );

          reject(err);
        });
    });

  // validateMeterNumber = function (data) {
  //   return new Promise(async (resolve, reject) => {
  //     let { provider, meterNumber } = data;
  //     let url = `${process.env.BillingURl}/v1/nepa/verify-meter`;
  //     let body = { service_type: provider, account_number: meterNumber };
  //     const token = "";
  //     handleAPICall(url, "POST", "bearer", token, body)
  //       .then((res) => {
  //         const status = res?.status;
  //         const response = res?.data;
  //         if (status === 200) {
  //         } else {
  //           reject({});
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(
  //           ".............................................................start"
  //         );

  //         console.log(error);

  //         console.log(
  //           ".............................................................end"
  //         );

  //         reject(error);
  //       });
  //   });
  // };
};
