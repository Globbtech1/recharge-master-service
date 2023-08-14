const { handleAPICall } = require("../dependency/apiServices");
const {
  convertToNaira,
  getProviderSourceImage,
  getProviderCashBack,
} = require("../dependency/UtilityFunctions");

exports.TvSubscription = class TvSubscription {
  constructor() {}

  getProviders = function (paymentProviders, PaymentId) {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {};
      let endpoint = `${process.env.BillingURl}/v1/cabletv/billers`;
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

  getprovidersBundle = (provider) => {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = { service_type: provider };
      let endpoint = `${process.env.BillingURl}/v1/cabletv/providers/bundles`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            // console.log(ResponseData[0], "ResponseData");
            let reformattedResponse = ResponseData.map((item) => {
              // let bundleName = item.name;
              // let price = convertToKobo(item.price);
              // let dataCode = item.datacode;
              // let validity = item.validity;
              // let allowance = item.allowance;
              // let PriceIn = "Kobo";
              let availablePricingOptions = item?.availablePricingOptions;
              let code = item?.code;
              let name = item?.name;
              let description = item?.description;

              // return {
              //   name: bundleName,
              //   price: price,
              //   datacode: dataCode,
              //   validity: validity,
              //   allowance: allowance,
              //   PriceIn,
              // };
              return { availablePricingOptions, code, name, description };
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
  };

  validateCustomerDetail = (data) => {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = {
        service_type: data?.provider,
        account_number: data?.decoder_number,
      };
      let endpoint = `${process.env.BillingURl}/v1/cabletv/subscriber/details`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          let status = res?.status;
          let data = res?.data;
          console.log(data, "datum");
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

  buyTvSubscription = (data) =>
    new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let endpoint = `${process.env.BillingURl}/v1/cabletv/free-entry`;
      // console.log(data, "datum");
      data.total_amount = convertToNaira(data?.total_amount);
      // console.log(data, "datum1");
      handleAPICall(endpoint, "POST", "bearer", AccessToken, data)
        .then((res) => {
          let response = res.data;
          let respStatus = res.status;
          console.log({ tvResponse: response, data });
          if (respStatus == 200) {
            let ResponseData = response?.data;
            // console.log(ResponseData, "datum");
            resolve(ResponseData);
          } else {
            reject(res);
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

  validateTvSubscriptionPrice = (data) => {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = { service_type: data?.provider };
      let endpoint = `${process.env.BillingURl}/v1/cabletv/providers/bundles`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            // console.log(ResponseData[0], "ResponseData");
            // let reformattedResponse = ResponseData.map((item) => {
            //   // let bundleName = item.name;
            //   // let price = convertToKobo(item.price);
            //   // let dataCode = item.datacode;
            //   // let validity = item.validity;
            //   // let allowance = item.allowance;
            //   // let PriceIn = "Kobo";
            //   let availablePricingOptions = item?.availablePricingOptions;
            //   let code = item?.code;
            //   let name = item?.name;
            //   let description = item?.description;

            //   // return {
            //   //   name: bundleName,
            //   //   price: price,
            //   //   datacode: dataCode,
            //   //   validity: validity,
            //   //   allowance: allowance,
            //   //   PriceIn,
            //   // };
            //   return { availablePricingOptions, code, name, description };
            // });
            let responseItem = ResponseData.find(
              (item) => item?.code === data?.bouquet
            );
            responseItem = responseItem?.availablePricingOptions.find(
              (item) => item?.monthsPaidFor == data?.productMonthsPaidFor
            );
            resolve(responseItem);
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
  };

  /*getproviderProductTypeBundle = (provider, productTypeName) => {
    return new Promise(async (resolve, reject) => {
      let AccessToken = "ResponseData.accessToken";
      let payload = { service_type: provider };
      let endpoint = `${process.env.BillingURl}/v1/cabletv/providers/bundles`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          console.log(res, "resres");
          let response = res.data;
          let respStatus = res.status;
          if (respStatus == 200) {
            let ResponseData = response?.data;
            // console.log(ResponseData[0], "ResponseData");
            let reformattedResponse = ResponseData.map((item) => {
              // let bundleName = item.name;
              // let price = convertToKobo(item.price);
              // let dataCode = item.datacode;
              // let validity = item.validity;
              // let allowance = item.allowance;
              // let PriceIn = "Kobo";
              let availablePricingOptions = item?.availablePricingOptions;
              let code = item?.code;
              let name = item?.name;
              let description = item?.description;

              // return {
              //   name: bundleName,
              //   price: price,
              //   datacode: dataCode,
              //   validity: validity,
              //   allowance: allowance,
              //   PriceIn,
              // };
              return { availablePricingOptions, code, name, description };
            });
            let reformattedResponse1 = ResponseData.find(
              (item) =>
                productTypeName == item.code || productTypeName == item?.name
            );
            console.log(reformattedResponse1);
            // resolve(reformattedResponse);
            resolve([])
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
  };*/
};
