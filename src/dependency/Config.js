const userCategories = [
  {
    id: "new-users",
    name: "New users",
    description: "Users less than 1 day on rechargeMaster",
  },
  {
    id: "inactive-users",
    name: "Inactive users",
    description:
      "Users that have not transacted on the portal since onboarding",
  },
  {
    id: "active-users",
    name: "Active Users",
    description: "Users with a minimum of 1 transaction per month",
  },
  {
    id: "all-users",
    name: "All users",
    description: "Every user that has an account with RechargeMaster",
  },
];

const CONSTANT = {
  status: {
    pending: 2,
    active: 1,
    deleted: 0,
    false: false,
    true: true,
  },
  RESERVED_ACCOUNT: "RESERVED_ACCOUNT",
  WEB_SDK: "WEB_SDK",
  AccountFunding: "Account-Funding",
  successMessage: {
    airtimePurchase: "Your Airtime Purchase is successful",
    dataPurchase: "Your Data Purchase was successful",
    electricityPurchase: "Your Electricity Units Purchase was successful",
    tvSubscriptionPurchase: "Your Television Subscription was successful",
    userRegistrationSuccess: "Registration successfully",
    transferFund: "Fund transfer successfully",
  },
  transactionStatus: {
    failed: "Failed",
    pending: "Pending",
    success: "Successful",
  },
  transactionPinSize: 4,
  fundingSource: [
    { name: "Self", type: "self" },
    { name: "pay For Me", type: "payForMe" },
  ],
  defaultProfileImage:
    "https://res.cloudinary.com/cvtechdom/image/upload/v1584379801/Cervitech_AndroidApp/bupwntkxpcmklgc0o3u0.png",

  transactionalMailContent: `
    Dear [user_name], \n
    
    We are writing to confirm that your payment for the [service_name] has been successfully processed on our platform. Below are the details of your transaction:
    \n\n\n
        Amount of Service: [amount] \n
        Service Name: [service_name]\n
        Transaction Date: [transaction_date] \n
        Amount Before: [amount_before]\n
        Amount After: [amount_after]\n
        Transaction Reference: [trans_ref]\n \n\n\n
    
    Please keep this email as your receipt for the payment made. If you have any questions or concerns regarding the transaction, please do not hesitate to reach out to our customer support team at [support_mail].
    
    Thank you for using our platform to pay your utility bills. We appreciate your business.
    
    Best regards,
    UfitSub`,

  supportEmail: "support@ufitsub.com",
  monnifyPaymentStatus: { paid: "PAID", expired: "EXPIRED" },
  monnifyBillTypes: {
    airtime: "Airtime",
    data: "Data-Bundle",
    electricity: "Electricity",
    television: "Tv-Subscription",
  },
  // PasswordRegex: `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$`,
  PasswordRegex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/`,
  payStackPaymentStatus: {
    success: "success",
    failed: "Failed",
    pending: "Pending",
  },
  verificationType: {
    email: "emailAddress",
    phoneNumber: "phoneNumber",
    changeTransactionPin: "changeTransactionPin",
  },
  externalRequestFailErrorMessage:
    "The request failed due to an external provider's error.",

  scheduleFrequency: {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  },
  billsPaymentType: {
    data: "Data_Plan",
    airtime: "airtime",
  },
  transactionInitiator: {
    schedule: "Schedule Payment",
    users: "Users",
  },
  internalProvider: "internal",
  userCategories,
  maximumAmountForUnverifiedAccount: 4000,
};

module.exports = { CONSTANT };
