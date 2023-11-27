const { handleAPICall } = require("../dependency/apiServices");

exports.MonifyIntegration = class MonifyIntegration {
  constructor() {
    // this.name = name;
    // this.level = level;
  }
  generatePaymentReference = () => {
    const timestamp = Date.now().toString(); // Get current timestamp
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); // Generate random number and pad with zeros

    const paymentReference = timestamp + random; // Combine timestamp and random number

    return paymentReference;
  };

  AuthenticateMonify = () =>
    new Promise(async (resolve, reject) => {
      console.log("AuthenticateMonify");
      // let endpoint = `${MONIFY_PAYLOAD.PAY_URL}/banks`
      let endpoint = `${process.env.MONIFY_BASEURL}/v1/auth/login`;

      // let token = MONIFY_PAYLOAD.CREDENTIALS;
      let token = {
        username: process.env.MONIFY_APIKEY,
        password: process.env.MONIFY_SECRET,
      };
      let payload = {};
      handleAPICall(endpoint, "POST", "basic", token, payload)
        .then((res) => {
          console.log(res.data, "<<<<<<<<<<<>>>>>>> fetchbanklist");
          let response = res.data;
          let respstatus = response.requestSuccessful;
          console.log(respstatus, "respresprespresp");
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

          console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });

  // Special - Quick situation control for second type of "Basic Token" Authorization
  // AuthenticateMonifyLogic2 = () =>
  //   new Promise(async (resolve, reject) => {
  //     let endpoint = `${process.env.MONIFY_BASEURL}/v1/auth/login`;
  //     let token = Buffer.from(
  //       process.env.MONIFY_APIKEY + ":" + process.env.MONIFY_SECRET
  //     ).toString("base64");
  //     let payload = {};
  //     handleAPICall(endpoint, "POST", "Basic2", token, payload)
  //       .then((res) => {
  //         let response = res.data;
  //         let respStatus = response.requestSuccessful;
  //         if (respStatus) {
  //           let resp = response.responseBody;
  //           resolve(resp);
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

  getTransactionStatus = (data) =>
    new Promise(async (resolve, reject) => {
      let ResponseData = await this.AuthenticateMonify();
      let AccessToken = ResponseData.accessToken;
      let transactionReference = data?.transactionReference;
      let payload = {};
      let endpoint = `${process.env.MONIFY_BASEURL}/v2/transactions/${transactionReference}`;
      handleAPICall(endpoint, "GET", "bearer", AccessToken, payload)
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

          console.log(error);
          console.log(
            ".............................................................end"
          );
          reject(error);
        });
    });

  generatePaymentLink = ({ amount, paymentId, email }) =>
    new Promise(async (resolve, reject) => {
      let monnifyResponse = await this.AuthenticateMonify();
      let monnifyAuthToken = monnifyResponse?.accessToken;
      // referenceNumber + amount + paymentId => to increase reliability of uniqueness
      let paymentReference =
        this.generatePaymentReference() + amount + paymentId;
      let payload = {
        amount,
        customerEmail: email,
        currencyCode: "NGN",
        contractCode: process.env.MONIFY_ContractCode,
        redirectUrl: process.env.MONIFY_BILL_REDIRECT_URL,
        paymentReference,
        paymentMethods: ["ACCOUNT_TRANSFER", "CARD", "USSD"],
      };
      let endpoint = `${process.env.MONIFY_BASEURL}/v1/merchant/transactions/init-transaction`;
      // console.log({ email, payload, promise: "Ihunna" });
      handleAPICall(endpoint, "POST", "Bearer", monnifyAuthToken, payload)
        .then((res) => {
          let response = res?.data;
          let respStatus = response?.requestSuccessful;
          if (respStatus) {
            response = response?.responseBody;
            resolve(response);
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
