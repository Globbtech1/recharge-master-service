const users = require("./users/users.service.js");
const userVerifications = require("./user-verifications/user-verifications.service.js");

const changeUserEmail = require("./change-user-email/change-user-email.service.js");

const testing = require("./testing/testing.service.js");

const updateUserProfile = require("./update-user-profile/update-user-profile.service.js");

const userProfile = require("./user-profile/user-profile.service.js");

const changeSecurityPin = require("./change-security-pin/change-security-pin.service.js");

const changeUserPassword = require("./change-user-password/change-user-password.service.js");

const paymentList = require("./payment-list/payment-list.service.js");

const airtimeProviders = require("./airtime/providers/providers.service.js");

const virtualaccountGenerateaccount = require("./virtualaccount/generateaccount/generateaccount.service.js");

const supportedBanks = require("./supported-banks/supported-banks.service.js");

const forgotPasswordInitiateResetPwd = require("./forgotPassword/initiate-reset-pwd/initiate-reset-pwd.service.js");

const forgotPasswordResetUserPassword = require("./forgotPassword/reset-user-password/reset-user-password.service.js");

const forgotPasswordVerifyOtp = require("./forgotPassword/verify-otp/verify-otp.service.js");

const monnifyPaymentCallback = require("./monnify/payment-callback/payment-callback.service.js");

const accountFunding = require("./account-funding/account-funding.service.js");

const accountBalance = require("./account-balance/account-balance.service.js");

const transactionsHistory = require("./transactions-history/transactions-history.service.js");

const paymentPaylist = require("./payment/paylist/paylist.service.js");

const userVirtualAccounts = require("./user/virtual-accounts/virtual-accounts.service.js");

const airtimeBuyAirtime = require("./airtime/buy-airtime/buy-airtime.service.js");

const transactionErrorLogs = require("./transaction-error-logs/transaction-error-logs.service.js");

const cashBackRewardUser = require("./cashBack/reward-user/reward-user.service.js");

const userQuickBeneficiary = require("./user/quick-beneficiary/quick-beneficiary.service.js");

const airtimeMyBeneficiaries = require("./airtime/my-beneficiaries/my-beneficiaries.service.js");

const paymentPaymentProviders = require("./payment/payment-providers/payment-providers.service.js");

const utilityFundingSource = require("./utility/funding-source/funding-source.service.js");

const dataProviders = require("./data/providers/providers.service.js");

const dataBundles = require("./data/bundles/bundles.service.js");

const dataBuyDataBundle = require("./data/buy-data-bundle/buy-data-bundle.service.js");

const dataMyBeneficiaries = require("./data/my-beneficiaries/my-beneficiaries.service.js");

const transactionsRecent = require("./transactions/recent/recent.service.js");

const transactionsUserHistory = require("./transactions/user-history/user-history.service.js");

const transactionsOverview = require("./transactions/overview/overview.service.js");

const userRemoveProfilePix = require("./user/remove-profile-pix/remove-profile-pix.service.js");

const userChangeUserProfilePix = require("./user/change-user-profile-pix/change-user-profile-pix.service.js");

const userDeleteUserAccount = require("./user/delete-user-account/delete-user-account.service.js");

const verifySecurityPin = require("./verify-security-pin/verify-security-pin.service.js");

const electricityBuyElectricity = require("./electricity/buy-electricity/buy-electricity.service.js");

const electricityProviders = require("./electricity/providers/providers.service.js");

const tvSubscriptionBuyTvSubscription = require("./tv-subscription/buy-tv-subscription/buy-tv-subscription.service.js");

const tvSubscriptionProviders = require("./tv-subscription/providers/providers.service.js");

const tvSubscriptionProviderProductTypes = require("./tv-subscription/provider-product-types/provider-product-types.service.js");

const tvSubscriptionMyBeneficiaries = require("./tv-subscription/my-beneficiaries/my-beneficiaries.service.js");

const electricityValidateMeterNumber = require("./electricity/validate-meter-number/validate-meter-number.service.js");

const electricityMyBeneficiaries = require("./electricity/my-beneficiaries/my-beneficiaries.service.js");

const tvSubscriptionProductTypeBundles = require("./tv-subscription/product-type-bundles/product-type-bundles.service.js");

const tvSubscriptionValidateTvDetails = require("./tv-subscription/validate-tv-details/validate-tv-details.service.js");

const userCreateTransactionPin = require("./user/create-transaction-pin/create-transaction-pin.service.js");

// const products = require("./products/products.service.js");

const productList = require("./product-list/product-list.service.js");

const accountFundingInnitiateFund = require("./accountFunding/innitiate-fund/innitiate-fund.service.js");

const accountFundingFundInnitiator = require("./accountFunding/fund-innitiator/fund-innitiator.service.js");

const accountFundingVerifyPayment = require("./accountFunding/verify-payment/verify-payment.service.js");

const fundTransferInnitiateRequest = require("./fundTransfer/innitiate-request/innitiate-request.service.js");

const fundTransferFinalizeRequest = require("./fundTransfer/finalize-request/finalize-request.service.js");

const emailVerification = require("./email-verification/email-verification.service.js");

const phoneVerification = require("./phone-verification/phone-verification.service.js");

const authVerifyUserEmail = require("./auth/verify-user-email/verify-user-email.service.js");

const authAccountVaerification = require("./auth/account-vaerification/account-vaerification.service.js");

const authVerifyUserPhoneNumber = require("./auth/verify-user-phone-number/verify-user-phone-number.service.js");

const providers = require("./providers/providers.service.js");

const billsProviders = require("./bills/providers/providers.service.js");

const billsProviderProducts = require("./bills/provider-products/provider-products.service.js");

const schedulePaymentScheduleBillsPayment = require("./schedulePayment/schedule-bills-payment/schedule-bills-payment.service.js");

const schedulePaymentProcessDuePayments = require("./schedulePayment/process-due-payments/process-due-payments.service.js");

const integrationsSmsService = require("./integrations/sms-service/sms-service.service.js");

const integrationsEmailService = require("./integrations/email-service/email-service.service.js");

const userTransactionPinInnitiateChangetransactionPin = require("./userTransactionPin/innitiate-changetransaction-pin/innitiate-changetransaction-pin.service.js");

const utilityVerifyUserOtp = require("./utility/verify-user-otp/verify-user-otp.service.js");

const userTransactionPinChangeUserTransactionPin = require("./userTransactionPin/change-user-transaction-pin/change-user-transaction-pin.service.js");

const utilityVerifyUserPassword = require("./utility/verify-user-password/verify-user-password.service.js");

const userGetMyScheduledBills = require("./user/get-my-scheduled-bills/get-my-scheduled-bills.service.js");

const userDeleteSchedulePayment = require("./user/delete-schedule-payment/delete-schedule-payment.service.js");

const userFavouriteRecharge = require("./user-favourite-recharge/user-favourite-recharge.service.js");

const userGetFavouriteRecharges = require("./user/get-favourite-recharges/get-favourite-recharges.service.js");

const userDeleteUserFavouriteRecharge = require('./user/delete-user-favourite-recharge/delete-user-favourite-recharge.service.js');

const adminCouponManagement = require('./admin/coupon-management/coupon-management.service.js');

const adminCouponUserCategory = require('./admin/coupon-user-category/coupon-user-category.service.js');

const userEligibleCoupons = require('./user/eligible-coupons/eligible-coupons.service.js');

const userRedemCoupon = require('./user/redem-coupon/redem-coupon.service.js');

const userMyBeneficiaries = require('./user/my-beneficiaries/my-beneficiaries.service.js');

const userMyReferers = require('./user/my-referers/my-referers.service.js');

const globalserviceAllEnums = require('./globalservice/all-enums/all-enums.service.js');

const notifications = require('./notifications/notifications.service.js');

const userNotification = require('./user-notification/user-notification.service.js');

const usedCoupon = require('./used-coupon/used-coupon.service.js');

const adminFetchUsers = require('./admin/fetch-users/fetch-users.service.js');

const adminDashboardData = require('./admin/dashboard-data/dashboard-data.service.js');

const adminTransactionHistory = require('./admin/transaction-history/transaction-history.service.js');

const adminFundingHistory = require('./admin/funding-history/funding-history.service.js');

const adminWalletTransferHistory = require('./admin/wallet-transfer-history/wallet-transfer-history.service.js');

const adminPromoBeneficiary = require('./admin/promo-beneficiary/promo-beneficiary.service.js');

const userResetTransactionPinInnitiateRequest = require('./user/resetTransactionPin/innitiate-request/innitiate-request.service.js');

const userResetTransactionPinFinalizeRequest = require('./user/resetTransactionPin/finalize-request/finalize-request.service.js');

const adminAdminManagement = require('./admin/admin-management/admin-management.service.js');

const adminSpecialOps = require('./admin/special-ops/special-ops.service.js');

const userSignupwithSocialMedia = require('./user/signupwith-social-media/signupwith-social-media.service.js');

const userSignInWithSocialMedia = require('./user/sign-in-with-social-media/sign-in-with-social-media.service.js');

const userDataValidation = require('./user/data-validation/data-validation.service.js');

const testSampleEmail = require('./test/sample-email/sample-email.service.js');

const testSampleSms = require('./test/sample-sms/sample-sms.service.js');

const userResendSignupCode = require('./user/resend-signup-code/resend-signup-code.service.js');

const userDeleteAccountRequestOtp = require('./user/delete-account-request-otp/delete-account-request-otp.service.js');

const userDeleteAccountRequestFinalize = require('./user/delete-account-request-finalize/delete-account-request-finalize.service.js');

const adminSetReferralsBonus = require('./admin/set-referrals-bonus/set-referrals-bonus.service.js');

const userReferralListBonus = require('./user-referral-list-bonus/user-referral-list-bonus.service.js');

const adminReferralReports = require('./admin/referral-reports/referral-reports.service.js');

const adminUserReferralList = require('./admin/user-referral-list/user-referral-list.service.js');

const jobsRunUserReferralBonus = require('./jobs/run-user-referral-bonus/run-user-referral-bonus.service.js');

const adminMobileBanners = require('./admin/mobile-banners/mobile-banners.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(userVerifications);
  app.configure(changeUserEmail);
  app.configure(testing);
  app.configure(updateUserProfile);
  app.configure(userProfile);
  app.configure(changeSecurityPin);
  app.configure(changeUserPassword);
  app.configure(paymentList);
  app.configure(airtimeProviders);
  app.configure(virtualaccountGenerateaccount);
  app.configure(supportedBanks);
  app.configure(forgotPasswordInitiateResetPwd);
  app.configure(forgotPasswordResetUserPassword);
  app.configure(forgotPasswordVerifyOtp);
  app.configure(monnifyPaymentCallback);
  app.configure(accountFunding);
  app.configure(accountBalance);
  app.configure(transactionsHistory);
  app.configure(paymentPaylist);
  app.configure(userVirtualAccounts);
  app.configure(airtimeBuyAirtime);
  app.configure(transactionErrorLogs);
  app.configure(cashBackRewardUser);
  app.configure(userQuickBeneficiary);
  app.configure(airtimeMyBeneficiaries);
  app.configure(paymentPaymentProviders);
  app.configure(utilityFundingSource);
  app.configure(dataProviders);
  app.configure(dataBundles);
  app.configure(dataBuyDataBundle);
  app.configure(dataMyBeneficiaries);
  app.configure(transactionsRecent);
  app.configure(transactionsUserHistory);
  app.configure(transactionsOverview);
  app.configure(userRemoveProfilePix);
  app.configure(userChangeUserProfilePix);
  app.configure(userDeleteUserAccount);
  app.configure(verifySecurityPin);
  app.configure(electricityBuyElectricity);
  app.configure(electricityProviders);
  app.configure(tvSubscriptionBuyTvSubscription);
  app.configure(tvSubscriptionProviders);
  app.configure(tvSubscriptionProviderProductTypes);
  app.configure(tvSubscriptionMyBeneficiaries);
  app.configure(electricityValidateMeterNumber);
  app.configure(electricityMyBeneficiaries);
  app.configure(tvSubscriptionProductTypeBundles);
  app.configure(tvSubscriptionValidateTvDetails);
  app.configure(userCreateTransactionPin);
  // app.configure(products);
  app.configure(productList);
  app.configure(accountFundingInnitiateFund);
  app.configure(accountFundingFundInnitiator);
  app.configure(accountFundingVerifyPayment);
  app.configure(fundTransferInnitiateRequest);
  app.configure(fundTransferFinalizeRequest);
  app.configure(emailVerification);
  app.configure(phoneVerification);
  app.configure(authVerifyUserEmail);
  app.configure(authAccountVaerification);
  app.configure(authVerifyUserPhoneNumber);
  app.configure(providers);
  app.configure(billsProviders);
  app.configure(billsProviderProducts);
  app.configure(schedulePaymentScheduleBillsPayment);
  app.configure(schedulePaymentProcessDuePayments);
  app.configure(integrationsSmsService);
  app.configure(integrationsEmailService);
  app.configure(userTransactionPinInnitiateChangetransactionPin);
  app.configure(utilityVerifyUserOtp);
  app.configure(userTransactionPinChangeUserTransactionPin);
  app.configure(utilityVerifyUserPassword);
  app.configure(userGetMyScheduledBills);
  app.configure(userDeleteSchedulePayment);
  app.configure(userFavouriteRecharge);
  app.configure(userGetFavouriteRecharges);
  app.configure(userDeleteUserFavouriteRecharge);
  app.configure(adminCouponManagement);
  app.configure(adminCouponUserCategory);
  app.configure(userEligibleCoupons);
  app.configure(userRedemCoupon);
  app.configure(userMyBeneficiaries);
  app.configure(userMyReferers);
  app.configure(globalserviceAllEnums);
  app.configure(notifications);
  app.configure(userNotification);
  app.configure(usedCoupon);
  app.configure(adminFetchUsers);
  app.configure(adminDashboardData);
  app.configure(adminTransactionHistory);
  app.configure(adminFundingHistory);
  app.configure(adminWalletTransferHistory);
  app.configure(adminPromoBeneficiary);
  app.configure(userResetTransactionPinInnitiateRequest);
  app.configure(userResetTransactionPinFinalizeRequest);
  app.configure(adminAdminManagement);
  app.configure(adminSpecialOps);
  app.configure(userSignupwithSocialMedia);
  app.configure(userSignInWithSocialMedia);
  app.configure(userDataValidation);
  app.configure(testSampleEmail);
  app.configure(testSampleSms);
  app.configure(userResendSignupCode);
  app.configure(userDeleteAccountRequestOtp);
  app.configure(userDeleteAccountRequestFinalize);
  app.configure(adminSetReferralsBonus);
  app.configure(userReferralListBonus);
  app.configure(adminReferralReports);
  app.configure(adminUserReferralList);
  app.configure(jobsRunUserReferralBonus);
  app.configure(adminMobileBanners);
};
