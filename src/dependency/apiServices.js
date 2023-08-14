var axios = require("axios");
const request = (
  url,
  type,
  data,
  authMode,
  token = null,
  // apiType = CONSTANTS.onboarding_url,
  noStringify = true,
  downloadFile = false
) => {
  // const baseURL = CONSTANTS.BASE_URL;
  // let API_URL = `${baseURL}${url}`;
  // let activeUrl = url.split('://');
  // console.log(activeUrl[0], 'exploded file');
  // if (activeUrl[0] === 'https' || activeUrl[0] === 'http') {
  //   API_URL = url;
  // } else {
  //   API_URL = `${baseURL}${url}`;
  // }
  let API_URL = `${url}`;
  let bodyData;
  let service;
  // bodyData = noStringify ? JSON.stringify(data) : data;
  // bodyData = JSON.stringify(data);
  // bodyData = qs.stringify(data);
  bodyData = data;
  let config;

  // if (downloadFile) {
  //   config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     responseType: 'arraybuffer',
  //   };
  // } else
  if (authMode.toLowerCase() === "bearer") {
    let TOKEN = `Bearer ${token}`;
    config = {
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        "Content-type": "application/json",
        Accept: "application/json",

        Authorization: TOKEN,
        // 'api-key': TOKEN,
      },
      timeout: 60 * 4 * 1000,
    };
    console.log("config", "here man tokennnnnn");
  } else if (authMode.toLowerCase() === "basic") {
    config = {
      // "Content-type": "application/x-www-form-urlencoded",
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        "Content-type": "application/json",
        // Authorization: "tife@smartrik.com" + ":" + "Smartrik1!",
        // Authorization: "Basic dGlmZUBzbWFydHJpay5jb206U21hcnRyaWsxIQ==",
        // Authorization: `Basic  ${token}`,
      },
      auth: token,
    };
  } else if (authMode.toLowerCase() === "basic2") {
    // Ihunna Promise - Above condition = Bad Hack, Quick Fix - 2023-06-04
    config = {
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    };
  } else if (authMode === "xHeader") {
    config = {
      // "Content-type": "application/x-www-form-urlencoded",
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        "Content-type": "application/json",
        ...token,
      },
    };
  } else {
    config = {
      // headers: {'Content-type': 'application/json'},
      // timeout: 60 * 4 * 1000,
      "Content-type": "application/json",
    };
    // console.log(config, 'here man');
  }

  if (type.toLowerCase() === "get") {
    service = axios.get(API_URL, config);
    return service
      .then((response) => {
        return service;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            //destroy client auth details and log user out
            // removeState();
            // sessionStorage.setItem("expired_token", "true");
            // history.push(ROUTES.login);
            // window.location.reload(true);fbasic
            // alert('Please login again');
          } else {
            return service;
          }
        }
        return service;
      });
  } else if (type.toLowerCase() === "post") {
    service = axios.post(API_URL, bodyData, config);
    return service
      .then((response) => {
        return service;
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          // console.log({
          //   API_URL,
          //   config,
          //   promiseError: JSON.stringify(error?.response?.data),
          //   Ihunna: "Ihunna",
          // });
          if (error.response.status === 401) {
            //destroy client auth details and log user out
            // removeState();
            // sessionStorage.setItem("expired_token", "true");
            // history.push(ROUTES.login);
            // window.location.reload(true);
            // alert('Please login again');
          } else {
            return service;
          }
        }
        return service;
      });
  } else if (type.toLowerCase() === "delete") {
    service = axios.delete(API_URL, config);
    return service
      .then(function (response) {
        return service;
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 401) {
            //destroy client auth details and log user out
            // removeState();
            // sessionStorage.setItem("expired_token", "true");
            // history.push(ROUTES.login);
            // window.location.reload(true);
            // alert('Please login again');
          } else {
            return service;
          }
        }
        return service;
      });
  } else {
    service = axios.put(API_URL, bodyData, config);
    return service
      .then(function (response) {
        return service;
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 401) {
            //destroy client auth details and log user out
            // removeState();
            // sessionStorage.setItem("expired_token", "true");
            // history.push(ROUTES.login);
            // window.location.reload(true);
            alert("Please login again");
          } else {
            return service;
          }
        }
        return service;
      });
  }
};

const handleAPICall = (route, method, authMode, token, data = {}) =>
  new Promise((resolve, reject) => {
    console.log(data);
    console.log("payload");
    request(route, method, data, authMode, token)
      .then((res) => {
        // this.handleAPIResponse(res.data, resType);
        // this.setState({
        //   LoadingState: false,
        // });
        // console.log(res, "Base_  success");
        // return res;
        resolve(res);
      })
      .catch((err) => {
        console.log(err, "base errorrororo");

        // this.setState({ showError: handleError(err), responseMsg: null })
        reject(err);
      });
  });

module.exports = { request, handleAPICall };
