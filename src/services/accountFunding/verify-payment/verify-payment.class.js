const { BadRequest, NotFound } = require("@feathersjs/errors");
const {
  convertToNaira,
  successMessage,
  errorMessage,
} = require("../../../dependency/UtilityFunctions");
var paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);
/* eslint-disable no-unused-vars */
exports.VerifyPayment = class VerifyPayment {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    console.log(id);
    try {
      const sequelize = this.app.get("sequelizeClient");
      const { users, fund_innitiator } = sequelize.models;

      const paymentDetails = await fund_innitiator.findOne({
        where: {
          deletedAt: null,
          reference: id,
          status: "pending",
        },
        // raw: true,
      });
      if (paymentDetails === null) {
        const notfound = new NotFound("Payment reference not found");
        return Promise.reject(notfound);
      }

      let paymentId = paymentDetails?.id;
      // const appointmentsDetails = await appointments.findOne({
      //   where: {
      //     deletedAt: null,
      //     paymentId: paymentId,
      //   },
      //   // raw: true,
      // });
      // if (appointmentsDetails === null) {
      //   const notfound = new NotFound("Patient appointments not found");
      //   return Promise.reject(notfound);
      // }

      let verifyResponse = await paystack.transaction.verify(id);
      console.log(verifyResponse, "verifyResponse");
      const { status, data, message } = verifyResponse;
      if (status) {
        console.log(data, "ppppppppppp");
        const { status, amount, authorization } = data;
        console.log(status);
        if (status === "success") {
          let nairaAmount = convertToNaira(amount);
          console.log(nairaAmount);
          // let appointmentId = appointmentsDetails?.id;
          // update appointment table

          // let Update_payload = {
          //   appointmentStatus: "upcoming",
          // };

          // var condition = {
          //   where: { id: appointmentId },
          // };

          // await appointments.update(Update_payload, condition);

          // await user_transactions.update(
          //   {
          //     status: "completed",
          //   },
          //   {
          //     where: { id: paymentId },
          //   }
          // );

          // insert into transaction history

          // let reference = paymentDetails?.referenceNumber;
          // let doctorId = appointmentsDetails?.userId;
          // let serviceId = appointmentsDetails?.serviceId;
          // let patientId = appointmentsDetails?.patientId;

          // const docServicesDetails = await doctor_services.findOne({
          //   where: {
          //     deletedAt: null,
          //     userId: doctorId,
          //     id: serviceId,
          //   },
          // });
          // const patientsDetails = await patients.findOne({
          //   where: {
          //     deletedAt: null,
          //     // userId: patientId,
          //     id: patientId,
          //   },
          // });

          // if (patientsDetails === null) {
          //   const notFound = new NotFound("Patient details not found");
          //   return Promise.reject(notFound);
          // }
          // const doctorDetails = await users.findOne({
          //   where: {
          //     deletedAt: null,
          //     id: doctorId,
          //   },
          // });

          // let transactionAmount = nairaAmount;
          // let payCat = `money Received #${reference}_${appointmentId}`;

          // let payload = {
          //   category: payCat,
          //   userId: doctorId,
          //   paymentId: paymentId,
          //   patientId: patientId,
          //   amount: transactionAmount,
          //   type: "credit",
          //   referenceNumber: reference,
          //   payData: authorization?.authorization_code,
          // };

          // transactions.create(payload);

          ////////////////////////////Notification segment ////////////
          // let NotificationSubject = "Payment Received";
          // let patientName = patientsDetails?.fullName;

          // let NotificationMessage = `Payment of ₦ [ ${formatAmount(
          //   nairaAmount
          // )}  ] received from ${patientName} for { ${
          //   docServicesDetails.serviceName
          // } } services`;
          // let notificationData = {
          //   userId: doctorId,
          //   subject: NotificationSubject,
          //   message: NotificationMessage,
          //   patientData: patientsDetails,
          //   doctorData: doctorDetails,
          //   action: CONSTANT.notifications.PAYMENT,
          // };
          // recordNotification(sequelize, notificationData);
          ////////////////////////////Notification segment ////////////

          return Promise.resolve(
            successMessage(
              verifyResponse,
              "Your donation has been received successfully"
            )
          );
        } else {
          await user_transactions.update(
            {
              status: status,
            },
            {
              where: { id: paymentId },
            }
          );

          return Promise.resolve(
            errorMessage(
              "Unable to determine payment status. please contact admin"
            )
          );
        }

        // resolve(successResp(data));
      } else {
        console.log(verifyResponse, "body..........");
        // reject(failedResp(message));
        // const notfound = new BadRequest(message);

        return Promise.resolve(errorMessage(message));
      }

      return;
    } catch (error) {
      console.log(error, "error");
      const notfound = new BadRequest(error);
      return Promise.reject(notfound);
    }
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
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
