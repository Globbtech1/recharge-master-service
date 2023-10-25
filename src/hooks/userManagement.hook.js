// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotFound } = require("@feathersjs/errors");
const { Op, Sequelize } = require("sequelize");
const {
  generateRandomNumber,
  errorMessage,
  successMessage,
  generateRandomString,
  ShowCurrentDate,
} = require("../dependency/UtilityFunctions");

const {
  changeUserEmailValidator,
  userEmailVerifyValidator,
} = require("../validations/auth.validation");
const { ReserveBankAccount } = require("./general-uses");
const Joi = require("joi");

// eslint-disable-next-line no-unused-vars

const checkIfsubmissionisongoing = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data, id } = context;
    const sequelize = app.get("sequelizeClient");
    const { call_for_submission, submissionstopic } = sequelize.models;

    const submissionData = await call_for_submission.findOne({
      where: {
        // userId: userId,
        deletedAt: null,
        status: "ongoing",
      },
    });
    console.log(submissionData, "submissionData");
    if (submissionData !== null) {
      // throw new Error(``, 400);
      return errorMessage(
        "There is a submission process ongoing. Please wait for it to be completed."
      );
      // context.error = "Error";
    }

    return context;
  };
};

const checkIfTsubmissionExist = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    console.log(data, "datasss");
    const sequelize = app.get("sequelizeClient");
    const { call_for_submission } = sequelize.models;
    let submissionId = data.callForSubmissionId;

    const submissionTopic = await call_for_submission.findOne({
      where: {
        // userId: userId,
        deletedAt: null,
        id: submissionId,
      },
    });
    console.log(submissionTopic, "submissionTopic");
    if (submissionTopic === null) {
      // throw new Error(``, 400);
      return errorMessage("Submission id  not found");
      // context.error = "Error";
    }

    // const submission = await app
    //   .service("call-for-submission")
    //   .get(submissionId, params);
    // console.log(submission, "submission");
    // if (!submission) {
    //   throw new Error(`submission not found`);
    // }
    return context;
  };
};
const includeSubmission = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { call_for_submission, users } = sequelize.models;
    params.sequelize = {
      include: [
        {
          // model: propertyInteriors,
          model: call_for_submission,
          // through: {
          //   attributes: ['createdAt', 'startedAt', 'finishedAt'],
          //   // where: {completed: true}
          // }
          // where: {
          //   deletedAt: null,
          // },
        },
        // {
        //   model: propertyInteriors,
        //   // as: 'interiors',
        //   attributes: {
        //     exclude: ["deletedAt", "status", "id", "userId", "createdAt", "updatedAt"],
        //   },
        // },
        // {
        //   model: scheduleConsultations,
        //   // as: 'interiors',
        //   attributes: {
        //     exclude: ["deletedAt", "status", "id", "userId", "createdAt", "updatedAt"],
        //   },
        // },
      ],
      raw: false,
    };

    return context;
  };
};
const requestChangeEmail = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");

    const notFound = new BadRequest("Route Not available");
    return Promise.reject(notFound);
    console.log(params.user, "params.user");
    const loggedInUser = params.user;
    const { user_verifications, users, change_user_email } = sequelize.models;
    const { error } = changeUserEmailValidator(data);
    console.log(error, "error??");

    if (error) {
      const ErrorMessage = new BadRequest(error.details[0].message);
      return Promise.reject(ErrorMessage);
    }
    let userEmail = loggedInUser.email;
    let newEmail = data.email;

    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        email: userEmail,
        // isVerify: true,
      },
    });
    if (userDetails === null) {
      const notFound = new BadRequest("User not found, please try again");
      return Promise.reject(notFound);
    }

    const newUserEmail = await users.findOne({
      where: {
        deletedAt: null,
        email: newEmail,
      },
    });
    if (newUserEmail !== null) {
      const EmailExist = new BadRequest(
        "This email can not be used, please try again"
      );
      return Promise.reject(EmailExist);
    }

    console.log(userDetails, "userDetails");
    const verification_reference = await generateRandomNumber(
      change_user_email,
      "code",
      6
    );

    context.data["oldEmail"] = userEmail;
    context.data["newEmail"] = newEmail;
    context.data["userId"] = userDetails.id;
    context.data["code"] = verification_reference;
    context.data["userData"] = userDetails;

    return context;
  };
};
const verifyChangeEmail = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { user_verifications, users } = sequelize.models;
    const { error } = changeUserEmailValidator(data);
    console.log(error, "error??");
    if (error) {
      const ErrorMessage = new BadRequest(error.details[0].message);
      return Promise.reject(ErrorMessage);
    }
    let userId = data.userId;
    let code = data.code;
    let newEmail = data.newEmail;
    let oldEmail = data.oldEmail;
    let userData = data.userData;
    console.log(userData, "userData");
    const userVerification = await user_verifications.findOne({
      where: {
        deletedAt: null,
        userId: userId,
        code: code,
        status: "pending",
      },
    });
    if (userVerification === null) {
      const notFound = new BadRequest("Verification code not found");
      return Promise.reject(notFound);
    }
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        email: oldEmail,
      },
    });
    if (userDetails === null) {
      const notFound = new BadRequest("User not found, please try again");
      return Promise.reject(notFound);
    }
    const newUserEmail = await users.findOne({
      where: {
        deletedAt: null,
        email: newEmail,
      },
    });
    if (newUserEmail !== null) {
      const EmailExist = new BadRequest(
        "This email can not be used, please try again"
      );
      return Promise.reject(EmailExist);
    }
    const updateUser = await users.update(
      {
        email: newEmail,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    if (updateUser === null) {
      const notFound = new BadRequest("User not found, please try again");
      return Promise.reject(notFound);
    }
    const updateVerification = await user_verifications.update(
      {
        status: "verified",
      },
      {
        where: {
          id: userVerification.id,
        },
      }
    );
    if (updateVerification === null) {
      const notFound = new BadRequest("User not found, please try again");
      return Promise.reject(notFound);
    }
  };
};

const verifyUserEmailChange = async (req, res) => {
  try {
    const { app, method, result, params, data, body } = req;
    console.log(body, "body");
    const sequelize = app.get("sequelizeClient");

    const { users, change_user_email } = sequelize.models;

    const { error } = userEmailVerifyValidator(body);

    if (error) {
      const ErrorMessage = new BadRequest(error.details[0].message);
      // return Promise.reject(ErrorMessage);
      return res.status(400).json(ErrorMessage);
    }
    const userEmail = body.email;
    const userCode = body.userCode;

    const mailRecordData = await change_user_email.findOne({
      where: {
        deletedAt: null,
        newEmail: userEmail,
        code: userCode,
        isUsed: false,
      },
      // order: sequelize.random(),
      order: [["id", "DESC"]],
    });
    if (mailRecordData === null) {
      const notFound = new BadRequest(
        "Verification code is invalid, please try again"
      );
      return res.status(404).json(notFound);
    }

    let userId = mailRecordData.userId;
    let newUserMail = mailRecordData.newEmail;
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        id: userId,
      },
    });
    if (userDetails === null) {
      const notFound = new NotFound("User not found, please try again");
      return res.status(404).json(notFound);
    }

    mailRecordData.isUsed = true;
    await mailRecordData.save();
    userDetails.email = newUserMail;
    await userDetails.save();

    return res
      .status(200)
      .json(successMessage(null, "Account email changed Successfully"));
  } catch (error) {
    console.log(error, "error????");
    return res.status(500).json(errorMessage("An error occurred", error, 500));
  }
};

const GenerateNewVirtualAccount = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    console.log(data, params, "params.user.id");
    const { bankCode } = data;
    const { users, generateaccount } = sequelize.models;
    let loggedInUser = params.user.id;
    const banksDetails = await generateaccount.findOne({
      where: {
        deletedAt: null,
        userId: loggedInUser,
        bankCode: bankCode,
      },
    });
    if (banksDetails !== null) {
      const bankExist = new BadRequest(
        "You can not generate two account from same bank"
      );
      return Promise.reject(bankExist);
    }
    const userDetails = await users.findOne({
      where: {
        deletedAt: null,
        id: loggedInUser,
        // isVerify: true,
      },
    });
    if (userDetails === null) {
      const notFound = new NotFound("User not found, please try again");
      return Promise.reject(notFound);
    }
    if (userDetails?.isVerify === false) {
      const notFound = new BadRequest(
        "User account not verified, Please verify your account"
      );
      return Promise.reject(notFound);
    }

    let fullName = userDetails.firstName + " " + userDetails.lastName;
    let email = userDetails.email;

    // bankCode = "035";
    let accountReference = await generateRandomString(
      generateaccount,
      "accountReference",
      20
    );
    const VirtualAccountInfo = {
      userId: loggedInUser,
      accountName: fullName,
      customerEmail: email,
      bankCode,
      generateAccount: generateaccount,
      accountReference: accountReference,
    };
    console.log(VirtualAccountInfo);
    let resp = await ReserveBankAccount(VirtualAccountInfo, false);
    // console.log(resp, "AccountDetails");

    if (resp === false) {
      const notFound = new BadRequest(
        "Can not complete request, please try again"
      );
      return Promise.reject(notFound);
    }

    let accountDetailsArray = resp?.accounts || [];
    let accountMonifyReference = resp.accountReference;
    let accountDetails = {};

    if (accountDetailsArray.length > 0) {
      accountDetails = accountDetailsArray[0];
      console.log(accountDetails, "accountDetails");

      let Payload = {
        userId: loggedInUser,
        bankName: accountDetails?.bankName,
        accountNumber: accountDetails?.accountNumber,
        accountReference: accountMonifyReference,
        otherDetails: JSON.stringify(resp),
        bankCode: bankCode,
      };
      context.data = Payload;
    } else {
      const notFound = new BadRequest(
        "Can not generate account at the moment , please try again"
      );
      return Promise.reject(notFound);
    }
    return context;
  };
};
const SendResponseGenerateAccount = (options = {}) => {
  return async (context) => {
    context.result = successMessage(null, "Account generated Successfully");
    return context;
  };
};
const FormatResponseProfile = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    console.log(result, "heheheh");
    // context.result = successMessage(result, "Account verified successfully");
    // return context;
  };
};
const getUserNecessaryInformation = (options = {}) => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { generateaccount, account_balance } = sequelize.models;
    params.sequelize = {
      include: [
        {
          model: generateaccount,

          attributes: {
            exclude: [
              "deletedAt",
              "status",
              "accountReference",
              "userId",
              "createdAt",
              "updatedAt",
              "otherDetails",
            ],
          },

          where: {
            deletedAt: null,
          },
        },
        {
          model: account_balance,
          attributes: {
            exclude: [
              "deletedAt",
              "isLocked",
              "userId",
              "createdAt",
              "updatedAt",
              "id",
            ],
          },

          where: {
            deletedAt: null,
          },
        },
      ],
      raw: false,
    };

    return context;
  };
};
const InitiateResetPassword = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { emailOrPhoneNumber } = data;
    if (!emailOrPhoneNumber) {
      let error = `Email or phone number is required`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    let payload = {
      deletedAt: null,
      [Sequelize.Op.or]: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    };
    const { initiate_reset_pwd, users } = sequelize.models;

    const userDetails = await users.findOne({
      where: payload,
    });
    if (userDetails === null) {
      let error = `User details not found in our database`;

      const notFound = new NotFound(error);
      return Promise.reject(notFound);
    }
    console.log(userDetails, "userDetails");
    let userId = userDetails?.id;
    let resetCode = await generateRandomNumber(
      initiate_reset_pwd,
      "code",
      6,
      false
    );

    let additionalOrderDetails = {
      code: resetCode,
      userId: userId,
      userDetails,
    };
    let currentDate = ShowCurrentDate();
    const updateVerification = await initiate_reset_pwd.update(
      {
        deletedAt: currentDate,
      },
      {
        where: {
          userId: userId,
          isUsed: false,
        },
      }
    );

    context.data = { ...context.data, ...additionalOrderDetails };
    return context;
  };
};
const validateCouponCode = () => {
  return async (context) => {
    const { app, method, result, params, data } = context;
    const sequelize = app.get("sequelizeClient");
    const { coupon_management, generateaccount } = sequelize.models;
    const { couponCode, productAmount } = data;

    let discountedPrice = 0;
    const schema = Joi.object({
      couponCode: Joi.string().required(),
      productAmount: Joi.number().required().min(1), // Minimum value is 1
    });

    // Validate the data
    const { error } = schema.validate(data);

    if (error) {
      // If there's a validation error, throw a BadRequest with the validation message
      let joiError = new BadRequest(error.details[0].message);
      return Promise.reject(joiError);
    }
    // const userDetails = await users.findOne({
    //   where: {
    //     deletedAt: null,
    //     id: loggedInUserId,
    //   },
    // });
    // if (userDetails === null) {
    //   throw new NotFound("User not found, please try again");
    // }

    // Find the coupon with the provided code
    const coupon = await coupon_management.findOne({
      where: {
        couponCode,
        validity: { [Sequelize.Op.gte]: new Date() },
        deletedAt: null,
      },
    });

    if (coupon) {
      let minimumRecharge = coupon?.minimumRecharge;
      let maximumRecharge = coupon?.maximumRecharge;
      if (productAmount < minimumRecharge) {
        const error = new BadRequest(
          `Minimum amount for this coupon code is ${minimumRecharge}`
        );
        return Promise.reject(error);
      }
      if (productAmount > maximumRecharge) {
        const error = new BadRequest(
          `Maximum amount for this coupon code is ${maximumRecharge}`
        );
        return Promise.reject(error);
      }
      if (coupon.valueIsPercentage) {
        // Calculate the discount percentage and apply it
        const discount = (coupon?.couponValue / 100) * productAmount;
        discountedPrice = productAmount - discount;
      } else {
        // Apply the fixed amount discount
        discountedPrice = productAmount - coupon?.couponValue;
      }
      if (discountedPrice < 0) {
        discountedPrice = 0;
      }
      let res = {
        amountToPay: discountedPrice,
        originalAmount: productAmount,
      };
      let AdditionalData = {
        couponDetails: res,
      };

      context.data = { ...context.data, ...AdditionalData };
    } else {
      const error = new BadRequest("Coupon not found or expired");
      return Promise.reject(error);
    }

    return context;
  };
};

module.exports = {
  checkIfsubmissionisongoing,
  checkIfTsubmissionExist,
  includeSubmission,
  requestChangeEmail,
  verifyUserEmailChange,
  GenerateNewVirtualAccount,
  SendResponseGenerateAccount,
  FormatResponseProfile,
  getUserNecessaryInformation,
  InitiateResetPassword,
  validateCouponCode,
};
