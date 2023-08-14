const { BadRequest, NotFound } = require("@feathersjs/errors");
const { MonifyIntegration } = require("../interfaces/monifyIntegration");
const { CONSTANT } = require("./Config");
const { monnifyPaymentStatus, transactionStatus, monnifyBillTypes } = CONSTANT;
const { AirtimePurchase } = require("../interfaces/airtimePurchase");
const {
  convertToKobo,
  convertToNaira,
  ShowCurrentDate,
  successMessage,
} = require("./UtilityFunctions");
const { DataPurchase } = require("../interfaces/dataPurchase");
const { ElectricityPurchase } = require("../interfaces/electricityPurchase");
const { TvSubscription } = require("../interfaces/tvSubscription");
const logger = require("../logger");

const confirmPayment = async (transactionReference, sequelize) => {
  const { guest_purchases } = sequelize.models;
  //   const { paymentReference } = params?.query;
  let purchase;
  let purchaseMetaData;
  let data;
  purchase = await guest_purchases.findOne({
    where: { referenceNumber: transactionReference },
  });
  if (!purchase) {
    // return Promise.reject(new BadRequest());
    return Promise.reject(new NotFound("Transaction not found"));
  }
  if (
    purchase?.transactionStatus === CONSTANT?.transactionStatus?.success &&
    purchase?.billStatus === CONSTANT?.transactionStatus?.success
  ) {
    return Promise.reject(
      new BadRequest(
        "You are attempting a duplicate request that was successful",
        purchase
      )
    );
  }
  const metaData = JSON.parse(purchase?.metaData);
  // const data = {
  //   phoneNumber: metaData?.phoneNumber,
  //   amount: convertToKobo(metaData?.amount),
  //   provider: metaData?.provider,
  // };

  // eliminated need for object accessors using object destruction
  const { transactionType } = metaData;
  const monnify = new MonifyIntegration();
  const monnifyResponse = await monnify.getTransactionStatus({
    transactionReference: purchase?.monnifyReference,
  });
  console.log(monnifyResponse, "monnifyResponse");
  const paymentStatus = monnifyResponse?.paymentStatus; // PAID || EXPIRED

  // update transactionStatus based on monnify paymentStatus
  if (paymentStatus === monnifyPaymentStatus?.paid) {
    purchase.transactionStatus = transactionStatus?.success;
  } else {
    purchase.transactionStatus = transactionStatus?.failed;
  }
  await purchase.save();

  // service initiation
  if (transactionType === monnifyBillTypes?.airtime) {
    data = {
      phoneNumber: metaData?.phoneNumber,
      amount: convertToKobo(metaData?.amount),
      provider: metaData?.provider,
    };
    let airtimePurchase = new AirtimePurchase();
    let airtimePaymentResponse = await airtimePurchase.buyAirtime(data);
    console.log({ airtimePaymentResponse });
    let providerStatus = airtimePaymentResponse?.status;
    if (providerStatus != "success") {
      purchaseMetaData = {
        "Transaction ID": "nill",
        "Phone Number": metaData?.phoneNumber,
        "Network Provider": metaData?.provider.toUpperCase(),
        Date: ShowCurrentDate(),
        Amount: metaData?.amount,
        Status: CONSTANT.transactionStatus.failed,
        Response: airtimePaymentResponse,
      };
      purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
      purchase.billStatus = CONSTANT.transactionStatus.failed;
      await purchase.save();
      return Promise.reject(
        new BadRequest(
          "Transaction was not successful, please try again",
          airtimePaymentResponse
        )
      );
    }
    let transactionReference = airtimePaymentResponse?.reference;
    purchaseMetaData = {
      "Transaction ID": transactionReference,
      "Phone Number": metaData?.phoneNumber,
      "Network Provider": metaData?.provider.toUpperCase(),
      Date: ShowCurrentDate(),
      Amount: metaData?.amount,
      Status: CONSTANT.transactionStatus.failed,
      Response: airtimePaymentResponse,
    };
    purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
    purchase.billStatus = CONSTANT.transactionStatus.success;
    await purchase.save();
    return Promise.resolve(
      successMessage("Transaction successful", airtimePaymentResponse)
    );
  }
  if (transactionType === monnifyBillTypes?.data) {
    data = {
      phoneNumber: metaData?.phoneNumber,
      amount: convertToKobo(metaData?.amount),
      provider: metaData?.provider,
      dataCode: metaData?.dataCode,
    };
    let dataPurchase = new DataPurchase();
    let dataPurchasePaymentResponse = await dataPurchase.buyDataPlans(data);
    let providerStatus = dataPurchasePaymentResponse?.status;
    if (providerStatus != "success") {
      purchaseMetaData = {
        "Transaction ID": "nill",
        "Phone Number": metaData?.phoneNumber,
        "Network Provider": metaData?.provider.toUpperCase(),
        "Data Bundle": metaData?.name,
        Date: ShowCurrentDate(),
        Amount: metaData?.amount,
        Status: CONSTANT.transactionStatus.failed,
        Response: dataPurchasePaymentResponse,
      };
      purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
      purchase.billStatus = CONSTANT.transactionStatus.failed;
      await purchase.save();
      return Promise.reject(
        new BadRequest("Transaction was not successful, please try again", {
          ...dataPurchasePaymentResponse,
          amount: metaData?.amount,
          name: metaData?.name,
        })
      );
    }
    let transactionReference = dataPurchasePaymentResponse?.reference;
    purchaseMetaData = {
      "Transaction ID": transactionReference,
      "Phone Number": metaData?.phoneNumber,
      "Network Provider": metaData?.provider.toUpperCase(),
      name: metaData?.name,
      Date: ShowCurrentDate(),
      Amount: metaData?.amount,
      Status: CONSTANT.transactionStatus.failed,
      Response: dataPurchasePaymentResponse,
    };
    purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
    purchase.billStatus = CONSTANT.transactionStatus.success;
    await purchase.save();
    return Promise.resolve(
      successMessage("Transaction successful", {
        ...dataPurchasePaymentResponse,
        amount: metaData?.amount,
        name: metaData?.name,
      })
    );
  }
  if (transactionType === monnifyBillTypes?.electricity) {
    data = {
      amount: convertToKobo(metaData?.amount),
      provider: metaData?.provider,
      meterNumber: metaData?.meterNumber,
      phoneNumber: metaData?.phoneNumber,
    };
    const electricityPurchase = new ElectricityPurchase();
    let electricityPurchaseResponse =
      await electricityPurchase.purchaseElectricityUnits(data);
    let purchaseStatus =
      electricityPurchaseResponse?.transactionMessage.toLowerCase() ===
      `topup successful on ${metaData?.meterNumber}`.toLowerCase();
    if (!purchaseStatus) {
      purchaseMetaData = {
        "Transaction ID": "nill",
        "Phone Number": metaData?.phoneNumber,
        "Electricity Provider": metaData?.provider.toUpperCase(),
        "Meter Number": metaData?.meterNumber,
        Date: ShowCurrentDate(),
        Amount: metaData?.amount,
        Status: CONSTANT.transactionStatus.failed,
        Response: electricityPurchaseResponse,
      };
      purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
      purchase.billStatus = CONSTANT.transactionStatus.failed;
      await purchase.save();
      return Promise.reject(
        new BadRequest("Transaction was not successful, please try again", {
          ...electricityPurchaseResponse,
          amount: metaData?.amount,
        })
      );
    }

    let transactionReference =
      electricityPurchaseResponse?.transactionReference;
    purchaseMetaData = {
      "Transaction ID": transactionReference,
      "Phone Number": metaData?.phoneNumber,
      "Electricity Provider": metaData?.provider.toUpperCase(),
      "Meter Number": metaData?.meterNumber,
      Date: ShowCurrentDate(),
      Amount: metaData?.amount,
      Status: CONSTANT.transactionStatus.failed,
      Response: electricityPurchaseResponse,
    };
    purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
    purchase.billStatus = CONSTANT.transactionStatus.success;
    await purchase.save();
    return Promise.resolve(
      successMessage("Transaction successful", {
        ...electricityPurchaseResponse,
        amount: metaData?.amount,
      })
    );
  }
  if (transactionType === monnifyBillTypes?.television) {
    data = {
      service_type: metaData?.provider,
      total_amount: convertToKobo(metaData?.amount),
      isBoxOffice: false,
      smartcard_number: metaData?.decoderNumber,
      product_monthsPaidFor: metaData?.productMonthsPaidFor,
    };

    const tvSubscription = new TvSubscription();
    const tvSubPurchaseResponse = await tvSubscription.buyTvSubscription(data);
    let purchaseStatus =
      tvSubPurchaseResponse?.transactionStatus.toLowerCase() === `success`;
    if (!purchaseStatus) {
      purchaseMetaData = {
        "Transaction ID": "nill",
        "TV Provider": metaData?.provider.toUpperCase(),
        "Decoder Number": metaData?.decoderNumber,
        Date: ShowCurrentDate(),
        Amount: metaData?.amount,
        Status: CONSTANT.transactionStatus.failed,
        Response: airtimePaymentResponse,
      };
      purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
      purchase.billStatus = CONSTANT.transactionStatus.failed;
      await purchase.save();
      return Promise.reject(
        new BadRequest("Transaction was not successful, please try again", {
          ...tvSubPurchaseResponse,
        })
      );
    }
    let transactionReference = tvSubPurchaseResponse?.transactionReference;
    purchaseMetaData = {
      "Transaction ID": transactionReference,
      "TV Provider": metaData?.provider.toUpperCase(),
      "Decoder Number": metaData?.decoderNumber,
      Date: ShowCurrentDate(),
      Amount: metaData?.amount,
      Status: CONSTANT.transactionStatus.failed,
      Response: tvSubPurchaseResponse,
    };
    purchase.purchaseMetaData = JSON.stringify(purchaseMetaData);
    purchase.billStatus = CONSTANT.transactionStatus.success;
    await purchase.save();
    return Promise.resolve(
      successMessage("Transaction successful", {
        ...tvSubPurchaseResponse,
      })
    );
  }

  return Promise.reject(new NotFound("Transaction not found"));
};

module.exports = { confirmPayment };
