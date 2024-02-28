/* eslint-disable no-unused-vars */
const AfricasTalking = require("africastalking");
const request = require("request");

exports.SmsService = class SmsService {
  constructor(options) {
    this.options = options || {};
    this.africastalking = new AfricasTalking({
      apiKey: process.env.AFRICANTALKING_APIKEY,
      username: process.env.AFRICANTALKING_USERNAME,
    });
  }

  async create(data, params) {
    // console.log(this.africastalking, "this.africastalking");
    return sendMessageWithTermi(data);
  }
};
async function sendMessageWithAfricaTalking(data) {
  const sms = this.africastalking.SMS;
  console.log(data, "data to sent");
  const { phoneNumber, message } = data;

  try {
    const response = await sms.send({ to: phoneNumber, message });
    console.log(response, "SMS-response");
    response.SMSMessageData.Recipients.forEach((recipient) => {
      const { number, status } = recipient;

      if (status === "Success") {
        // Handle successful delivery to non-DND numbers
        console.log(`SMS sent successfully to ${number}`);
      } else if (status === "DoNotDisturbRejection") {
        // Handle DND numbers or other delivery issues
        console.log(`SMS to ${number} encountered delivery issue: ${status}`);
        // Implement retry logic or alternative notification method
      } else {
        // Handle other status codes as needed
        console.log(
          `SMS to ${number} encountered unexpected status: ${status}`
        );
      }
    });

    return response;
  } catch (error) {
    console.log(error, "error");
    throw new Error("Error sending SMS:", error);
  }
}
async function sendMessageWithTermi(data, route = "dnd") {
  try {
    const response = await sendSMS(data, route);
    console.log(response);
    // Process the response as needed
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Error sending SMS:", error);
  }
}
async function sendSMS(data, route) {
  return new Promise((resolve, reject) => {
    // Convert "to" field to an array if it's not already
    const toNumbers = Array.isArray(data?.phoneNumber)
      ? data?.phoneNumber
      : [data?.phoneNumber];

    const requestData = {
      to: toNumbers, // Change this to match the Termii API
      from: "N-Alert", // Change this to your desired sender ID
      sms: data.message,
      type: "plain",
      api_key: "TLIU9tWn8wjt474IjacuhLKJ7L4xe2xkPeFxSh65Qj0cGhluNLSCCv8O8EeN3F", // Replace with your Termii API key
      // channel: "generic",
      channel: route,
    };
    console.log(requestData, "requestData");

    const options = {
      method: "POST",
      url: "https://api.ng.termii.com/api/sms/send/bulk",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseBody = JSON.parse(body);
          resolve(responseBody);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}
