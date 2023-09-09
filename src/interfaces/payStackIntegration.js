// services/paystack.js
// const axios = require("axios");

// class PaystackService {
exports.PaystackService = class PaystackService {
  constructor(options) {
    this.options = options || {};
    this.apiUrl = "https://api.paystack.co";
    this.apiKey = this.options.apiKey; // Your Paystack API Key
  }

  initializePayment = async (data) => {
    try {
      const response = await axios.post(
        `${this.apiUrl}/transaction/initialize`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Paystack error: ${error.response.data.message}`);
    }
  };

  async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Paystack error: ${error.response.data.message}`);
    }
  }
  reserveAccountNumber = (data) =>
    new Promise(async (resolve, reject) => {
      let ResponseData = await this.AuthenticateMonify();
      let AccessToken = ResponseData.accessToken;
      let bankCode = data.bankCode;
      let accountReference = data.accountReference;
      console.log("CreateSubAccountAsync");
      let payload = {
        // accountReference: `wabdeeeeeweeeweeece1ww11e90_${bankCode}_${data.userId}`,
        accountReference: accountReference,
        accountName: data.accountName,
        currencyCode: "NGN",
        contractCode: process.env.MONIFY_ContractCode,
        customerEmail: data.customerEmail,
        // "bvn": "21212121212",
        customerName: data.accountName,
        getAllAvailableBanks: false,
        preferredBanks: [bankCode],
      };
      let endpoint = `${process.env.MONIFY_BASEURL}/v2/bank-transfer/reserved-accounts`;
      handleAPICall(endpoint, "POST", "bearer", AccessToken, payload)
        .then((res) => {
          let response = res.data;
          let respstatus = response.requestSuccessful;
          // console.log(respstatus, "respresprespresp");
          if (respstatus) {
            let resp = response.responseBody;
            resolve(resp);
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

// module.exports = function (options) {
//   return new PaystackService(options);
// };

// module.exports.Service = PaystackService;
