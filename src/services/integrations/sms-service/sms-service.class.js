/* eslint-disable no-unused-vars */
const AfricasTalking = require("africastalking");
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

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
