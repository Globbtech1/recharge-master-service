const { handleAPICall } = require("../dependency/apiServices");

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
      let endpoint =
        "https://ufisub-service.herokuapp.com/api/v1/airtime/providers";
      let token = "null";
      handleAPICall(endpoint, "get", "bearer", token, payload)
        .then((res) => {
          console.log(res.data, "<<<<<<<<<<<>>>>>>>");
          let ResponseData = res.data?.data;
          let reformattedResponse = ResponseData.map((item) => {
            let shortName = item.shortname;
            return {
              provider: item.service_type,
              shortname: shortName,
              //   biller_id: 13,
              //   product_id: 42,
              name: item.name,
              // image: "https://www.baxi.com/images/airtime/" + item.biller_id,
              image: `https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/${shortName}.png`,
              //   plan: ["prepaid"],
            };
          });
          resolve(reformattedResponse);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
};
