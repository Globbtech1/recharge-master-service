const { handleAPICall } = require("../dependency/apiServices");
const {
  convertToNaira,
  getProviderSourceImage,
  getProviderCashBack,
} = require("../dependency/UtilityFunctions");

exports.AirtimePurchase = class AirtimePurchase {
  constructor() {
    // this.name = name;
    // this.level = level;
  }

  getProviderList = (paymentProviders, PaymentId) =>
    new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {};
      let endpoint = `${process.env.BillingURl}/v1/airtime/providers`;
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
            reject({});
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
  buyAirtime = (data) =>
    new Promise(async (resolve, reject) => {
      let userAmount = data?.amount;
      let amountInNaira = convertToNaira(userAmount);
      const { phoneNumber, provider } = data;
      let AccessToken = "ResponseData.accessToken";
      let payload = {
        phone: phoneNumber,
        amount: amountInNaira,
        service_type: provider,
        plan: "prepaid",
      };
      let endpoint = `${process.env.BillingURl}/v1/airtime`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            resolve(ResponseData);
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
