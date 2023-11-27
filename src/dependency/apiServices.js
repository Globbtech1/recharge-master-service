const axios = require("axios");

const request = async (
  url,
  type,
  data,
  authMode,
  token = null,
  noStringify = true,
  downloadFile = false
) => {
  let API_URL = url;
  let bodyData = data;
  let config;

  if (authMode.toLowerCase() === "bearer") {
    config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 60 * 4 * 1000,
    };
  } else if (authMode.toLowerCase() === "basic") {
    config = {
      headers: {
        "Content-type": "application/json",
      },
      auth: token,
    };
  } else if (authMode.toLowerCase() === "baxiapi") {
    config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "x-api-key": `${process.env.BAXI_TOKEN}`,
      },
      timeout: 60 * 4 * 1000,
    };
  } else if (authMode.toLowerCase() === "basic2") {
    config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    };
  } else if (authMode === "xHeader") {
    config = {
      headers: {
        "Content-type": "application/json",
        ...token,
      },
    };
  } else {
    config = {
      "Content-type": "application/json",
    };
  }

  try {
    const response = await axios[type.toLowerCase()](API_URL, bodyData, config);
    return response;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // Handle 401 errors
    }
    return error.response;
  }
};

const handleAPICall = async (route, method, authMode, token, data = {}) => {
  try {
    const res = await request(route, method, data, authMode, token);
    console.log(res.data);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { request, handleAPICall };
