// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  errorMessage,
  successMessage,
  generateRandomNumber,
  generateRandomString,
  convertToKobo,
  failedResp,
  successResp,
  formatAmount,
  capitalizeFirstLetter,
} = require("../dependency/UtilityFunctions");

// var Mailchimp = require("mailchimp-api-v3");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const {
  userAccountVerifyValidator,
  resendVerificationCodeValidator,
} = require("../validations/auth.validation");
const { NotFound, BadRequest } = require("@feathersjs/errors");
const {
  VerificationMailBodyContent,
} = require("../dependency/templates/templates");
const { SendEmail } = require("../dependency/commonRequest");
const { MonifyIntegration } = require("../interfaces/monifyIntegration");
const winston = require("winston");
const SlackHook = require("winston-slack-webhook-transport");
const { CONSTANT } = require("../dependency/Config");
mailchimp.setConfig({
  apiKey: "9e042aec617b1584dd34c94cc1d59389-us6",
  server: "us6",
});
var paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const insertIntoVerification = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { user_verifications, generateaccount } = sequelize.models;
    const verification_reference = await generateRandomNumber(
      user_verifications,
      "code",
      6,
      false
    );
    console.log(verification_reference, "slug");
    const userId = result.id;
    user_verifications.create({
      userId: userId,
      code: verification_reference,
      status: false,
    });
    // context.data["verificationCode"] = ;
    let AdditionalData = {
      verificationCode: verification_reference,
      amount: 0,
      loggedInUser: userId,
    };
    context.data = { ...context.data, ...AdditionalData };
    return context;
  };
};
const sendSlackNotification = (options = {}) => {
  return async (context) => {
    const { result } = context;
    const { slackNotificationData } = result;
    pushSlackNotification(slackNotificationData, "info");
    return context;
  };
};

const sendTransactionEmail = (options = {}) => {
  return async (context) => {
    const { app, data, params, result } = context;

    // let loggedInUserId = params?.user?.id;
    console.log(result, "mmmmmmmmmmmm");
    // console.log(data, "mmmmmmmmmmmm");

    // return;
    const { transactionStatus } = result;
    console.log(transactionStatus, "transactionStatus");

    if (transactionStatus === CONSTANT.transactionStatus.failed) {
      return context;
    }
    const sequelize = app.get("sequelizeClient");
    const { users, product_list: product } = sequelize.models;
    const {
      userId,
      amountBefore,
      amountAfter,
      amount,
      referenceNumber,
      paymentType,
      paidBy,
    } = data;
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        id: userId,
        // isVerify: true,
      },
    });
    const userEmail = userDetails?.email;
    const { productListId, transactionDate } = data;
    const productDetail = await product.findOne({
      where: {
        id: productListId,
        // isActive: true,
        deletedAt: null,
      },
    });
    const productName = productDetail.productName;

    const subject = `RechargeMaster Transaction Notification [${capitalizeFirstLetter(
      paymentType
    )}: ${formatAmount(amount)}]`;
    let extraNote =
      paidBy === CONSTANT.transactionInitiator.schedule
        ? "This transaction was initiated as per your prior scheduling."
        : "";
    let EmailSendingData = {
      receiverEmail: userEmail,
      subject: subject,
      emailData: {
        recipient: userDetails.fullName,
        serviceName: productName,
        amount: formatAmount(amount),
        transactionDate: transactionDate,
        amountBefore: formatAmount(amountBefore),
        amountAfter: formatAmount(amountAfter),
        transactionReference: referenceNumber,
        paymentType: capitalizeFirstLetter(paymentType),
        extraNote,
      },

      templateName: "transaction-email",
    };

    context.app.service("integrations/email-service").create(EmailSendingData);

    return context;
  };
};

const verifyUserAccount = async (req, res) => {
  try {
    const { app, method, result, params, data, body } = req;
    // console.log(body, "body");
    const sequelize = app.get("sequelizeClient");

    const { users, user_verifications, generateaccount } = sequelize.models;

    const { error } = userAccountVerifyValidator(body);

    if (error) {
      const ErrorMessage = new BadRequest(error.details[0].message);
      // return Promise.reject(ErrorMessage);
      return res.status(400).json(ErrorMessage);
    }
    const userEmail = body.email;
    const userCode = body.userCode;
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        email: userEmail,
        isVerify: false,
      },
    });
    if (userDetails === null) {
      const notFound = new NotFound("User not found, please try again");
      // return Promise.reject(notFound);
      return res.status(404).json(notFound);
    }
    const userId = userDetails.id;
    const userVerification = await user_verifications.findOne({
      where: {
        userId: userId,
        code: userCode,
        isUsed: false,
      },
    });
    if (userVerification === null) {
      const ErrorMessage = new BadRequest(
        "Verification code is invalid, please try again"
      );
      // return Promise.reject(ErrorMessage);
      return res.status(400).json(ErrorMessage);
    }
    userVerification.isUsed = true;
    await userVerification.save();
    userDetails.isVerify = true;
    await userDetails.save();
    let fullName = userDetails.firstName + " " + userDetails.lastName;
    let email = userDetails.email;

    bankCode = "035";
    let accountReference = await generateRandomString(
      generateaccount,
      "accountReference",
      20
    );
    const VirtualAccountInfo = {
      userId: userId,
      accountName: fullName,
      customerEmail: email,
      bankCode,
      generateAccount: generateaccount,
      accountReference: accountReference,
    };
    ReserveBankAccount(VirtualAccountInfo);

    return res
      .status(200)
      .json(successMessage(null, "Account verified successfully"));
  } catch (error) {
    console.log(error, "error????");
    return res.status(500).json(errorMessage("An error occurred", error, 500));
  }
};
const resendVerificationCode = async (req, res) => {
  try {
    const { app, method, result, params, data, body } = req;
    console.log(body, "body");
    const sequelize = app.get("sequelizeClient");

    const { users, user_verifications } = sequelize.models;

    const { error } = resendVerificationCodeValidator(body);

    if (error) {
      const ErrorMessage = new BadRequest(error.details[0].message);
      return res.status(400).json(ErrorMessage);
    }
    const userEmail = body.email;
    const userCode = body.userCode;
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        email: userEmail,
        isVerify: false,
      },
    });
    if (userDetails === null) {
      const notFound = new NotFound("User not found, please try again");
      return res.status(404).json(notFound);
    }
    const userId = userDetails.id;
    const userVerification = await user_verifications.findOne({
      where: {
        userId: userId,
        isUsed: false,
      },
    });
    if (userVerification === null) {
      const ErrorMessage = new BadRequest(
        "Can not resend code. please contact support"
      );
      return res.status(400).json(ErrorMessage);
    }
    const verification_reference = await generateRandomNumber(
      user_verifications,
      "code",
      6,
      false
    );

    // }
    userVerification.code = verification_reference;
    await userVerification.save();
    Payloads = {
      userEmail: userEmail,
      customerName: `${userDetails.firstName} ${userDetails.lastName} `,
      verificationCode: verification_reference,
    };
    mailBody = await VerificationMailBodyContent(Payloads);
    SendEmail(Payloads, mailBody, "Welcome to UfitSub");

    return res
      .status(200)
      .json(successMessage(null, "Verification code sent  successfully"));
  } catch (error) {
    console.log(error, "error????");
    return res.status(500).json(errorMessage("An error occurred", error, 500));
  }
};
const ReserveBankAccount = async (Info, record = true) => {
  try {
    const {
      userId,
      accountName,
      customerEmail,
      bankCode,
      generateAccount,
      accountReference,
    } = Info;
    const Monnify = new MonifyIntegration();
    let dataPay = {
      userId: userId,
      accountName: accountName,
      customerEmail: customerEmail,
      bankCode: bankCode,
      accountReference: accountReference,
    };
    let resp = await Monnify.reserveAccountNumber(dataPay);
    let accountDetailsArray = resp.accounts;
    let accountMonifyReference = resp.accountReference;
    let accountDetails = {};
    if (record) {
      if (accountDetailsArray.length > 0) {
        accountDetails = accountDetailsArray[0];
        console.log(accountDetails, "accountDetails");
        generateAccount.create({
          userId: userId,
          bankName: accountDetails?.bankName,
          accountNumber: accountDetails?.accountNumber,
          accountReference: accountMonifyReference,
          otherDetails: JSON.stringify(resp),
          // otherDetails: null,
          bankCode: bankCode,
        });
      }
    } else {
      return resp;
    }
  } catch (error) {
    console.log(error, "error????");
    // return res.status(500).json(errorMessage("An error occurred", error, 500));
    return false;
  }
};
const CalculationRequestHash = async (stringifiedRequestBody) => {
  try {
    const sha512 = require("js-sha512").sha512;

    const DEFAULT_MERCHANT_CLIENT_SECRET = process.env.MONIFY_SECRET;

    const computeHash = (requestBody) => {
      const result = sha512.hmac(DEFAULT_MERCHANT_CLIENT_SECRET, requestBody);
      return result;
    };

    const computedHash = computeHash(stringifiedRequestBody);
    console.log("Computed hash", computedHash);
    return computedHash;
  } catch (error) {
    console.log(error, "error????");
    // return res.status(500).json(errorMessage("An error occurred", error, 500));
    return false;
  }
};

const SendGeneralResponse = (options = {}) => {
  const { message, data = null } = options;
  return async (context) => {
    context.result = successMessage(data, message);
    return context;
  };
};

const pushSlackNotification = (information, notificationType) => {
  let slackChannel = process.env.SLACK_WEBHOOK;
  let stringifyMessage = JSON.stringify(information);
  // let stringifyMessage = stringify(information);
  const logger = winston.createLogger({
    level: "info",
    transports: [
      new SlackHook({
        webhookUrl: slackChannel,
      }),
    ],
  });
  logger.log({
    // private: true,
    level: notificationType,
    message: stringifyMessage,
  });
  console.log(stringifyMessage, notificationType);
};

const checkForExistingValues = (options = {}) => {
  return async (context) => {
    const { fieldsToCheck, serviceType = "users" } = options;
    const { app, data } = context;
    for (const field of fieldsToCheck) {
      const { fieldName, friendlyName } = field;
      const fieldValue = data[fieldName];
      // "users";
      // Check if the specified field value already exists
      const existingUser = await context.app.service(serviceType).find({
        query: { [fieldName]: fieldValue },
      });
      if (existingUser?.data.length > 0) {
        // Value already exists; prevent the user from being created
        throw new Error(`${friendlyName} is already Exist`);
      }
    }
    return context;
  };
};
const checkIfNotExisting = (options = {}) => {
  return async (context) => {
    const { fieldsToCheck, serviceType = "users" } = options;
    const { app, data } = context;
    for (const field of fieldsToCheck) {
      const { fieldName, friendlyName, value } = field;
      const fieldValue = data[value];
      // "users";
      // Check if the specified field value already exists
      const existingUser = await context.app.service(serviceType).find({
        query: { [fieldName]: fieldValue },
      });
      if (existingUser?.data.length < 1) {
        // Value already exists; prevent the user from being created
        throw new Error(`${friendlyName} does not exist`);
      }
    }
    return context;
  };
};
const GeneratePaymentUrl = async (email, amount, ref) =>
  new Promise(async (resolve, reject) => {
    let payload = {
      email: email,
      amount: amount,
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      reference: ref,
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
    };
    paystack.transaction
      .initialize(payload)
      .then(function (body) {
        const { status, data, message } = body;
        if (status) {
          console.log(data);
          resolve(successResp(data));
        } else {
          console.log(body, "body..........");
          reject(failedResp(message));
        }
      })
      .catch(function (error) {
        console.log(error, "error");
        let message = "unable to generate payment link. please try again later";
        reject(failedResp(message));
      });
  });
const VerifyPaymentPayload = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    let loggedInUser = params.user.id;
    const { amount: AmountFunded } = data;

    const { users, fund_innitiator } = sequelize.models;
    if (!AmountFunded) {
      const badRequest = new BadRequest("Please enter amount to fund");
      return Promise.reject(badRequest);
    }
    const users_Details = await users.findOne({
      where: {
        deletedAt: null,

        id: loggedInUser,
      },
    });

    if (users_Details === null) {
      const notFound = new NotFound("This account does not exist");
      return Promise.reject(notFound);
    }
    let userEmail = users_Details?.email;
    // const doctorDetails = await users.findOne({
    //   where: {
    //     deletedAt: null,
    //     id: loggedInUser,
    //   },
    // });
    // let serviceAmount = docServicesDetails.servicePrice;
    // let patientEmail = patientsDetails.email;
    let amount = convertToKobo(AmountFunded);
    let PaymentReferenceNumber = await generateRandomNumber(
      fund_innitiator,
      "reference",
      22
    );

    const paymentData = await GeneratePaymentUrl(
      userEmail,
      amount,
      PaymentReferenceNumber
    );
    const { success } = paymentData;
    if (!success) {
      let error = new NotFound(
        "Can not fund Account   at the moment, please try again later"
      );
      return Promise.reject(error);
    }
    let payStackResponseData = paymentData.data;
    console.log(payStackResponseData, "paymentData");

    let payload = {
      payData: payStackResponseData,
      status: "pending",
      referenceNumber: PaymentReferenceNumber,
      userEmail,
      amount: AmountFunded,
    };

    let AdditionalData = {
      ...payload,
    };

    context.data = { ...context.data, ...AdditionalData };

    return context;
  };
};
module.exports = {
  insertIntoVerification,
  verifyUserAccount,
  resendVerificationCode,
  ReserveBankAccount,
  CalculationRequestHash,
  SendGeneralResponse,
  sendSlackNotification,
  pushSlackNotification,
  sendTransactionEmail,
  checkForExistingValues,
  checkIfNotExisting,
  GeneratePaymentUrl,
  VerifyPaymentPayload,
};
