const users = require("./users/users.service.js");
const userVerifications = require("./user-verifications/user-verifications.service.js");

const changeUserEmail = require("./change-user-email/change-user-email.service.js");

const testing = require("./testing/testing.service.js");

const updateUserProfile = require("./update-user-profile/update-user-profile.service.js");

const userProfile = require("./user-profile/user-profile.service.js");

const setSecurityPin = require("./set-security-pin/set-security-pin.service.js");

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

const verifySecurityPin = require('./verify-security-pin/verify-security-pin.service.js');

const electricityBuyElectricity = require('./electricity/buy-electricity/buy-electricity.service.js');

const electricityProviders = require('./electricity/providers/providers.service.js');

const tvSubscriptionBuyTvSubscription = require('./tv-subscription/buy-tv-subscription/buy-tv-subscription.service.js');

const tvSubscriptionProviders = require('./tv-subscription/providers/providers.service.js');

const tvSubscriptionProviderProductTypes = require('./tv-subscription/provider-product-types/provider-product-types.service.js');

const tvSubscriptionMyBeneficiaries = require('./tv-subscription/my-beneficiaries/my-beneficiaries.service.js');

const electricityValidateMeterNumber = require('./electricity/validate-meter-number/validate-meter-number.service.js');

const electricityMyBeneficiaries = require('./electricity/my-beneficiaries/my-beneficiaries.service.js');

const tvSubscriptionProductTypeBundles = require('./tv-subscription/product-type-bundles/product-type-bundles.service.js');

const tvSubscriptionValidateTvDetails = require('./tv-subscription/validate-tv-details/validate-tv-details.service.js');

const guestAirtimeBuyAirtime = require('./guest/airtime/buy-airtime/buy-airtime.service.js');

const guestAirtimeProviders = require('./guest/airtime/providers/providers.service.js');

const guestDataBuyData = require('./guest/data/buy-data/buy-data.service.js');

const guestDataProviders = require('./guest/data/providers/providers.service.js');

const guestDataBundles = require('./guest/data/bundles/bundles.service.js');

const guestElectricityBuyElectricity = require('./guest/electricity/buy-electricity/buy-electricity.service.js');

const guestElectricityProviders = require('./guest/electricity/providers/providers.service.js');

const guestElectricityVerifyMeterNumber = require('./guest/electricity/verify-meter-number/verify-meter-number.service.js');

const guestTvTvSubscription = require('./guest/tv/tv-subscription/tv-subscription.service.js');

const guestTvProviders = require('./guest/tv/providers/providers.service.js');

const guestTvVerifyTvDetails = require('./guest/tv/verify-tv-details/verify-tv-details.service.js');

const guestTvProviderProductTypes = require('./guest/tv/provider-product-types/provider-product-types.service.js');

const guestTvProductTypeBundles = require('./guest/tv/product-type-bundles/product-type-bundles.service.js');

const guestConfirm = require('./guest/confirm/confirm.service.js');

const guestGuestPurchase = require('./guest/guest-purchase/guest-purchase.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(userVerifications);
  app.configure(changeUserEmail);
  app.configure(testing);
  app.configure(updateUserProfile);
  app.configure(userProfile);
  app.configure(setSecurityPin);
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
  app.configure(guestAirtimeBuyAirtime);
  app.configure(guestAirtimeProviders);
  app.configure(guestDataBuyData);
  app.configure(guestDataProviders);
  app.configure(guestDataBundles);
  app.configure(guestElectricityBuyElectricity);
  app.configure(guestElectricityProviders);
  app.configure(guestElectricityVerifyMeterNumber);
  app.configure(guestTvTvSubscription);
  app.configure(guestTvProviders);
  app.configure(guestTvVerifyTvDetails);
  app.configure(guestTvProviderProductTypes);
  app.configure(guestTvProductTypeBundles);
  app.configure(guestConfirm);
  app.configure(guestGuestPurchase);
};
