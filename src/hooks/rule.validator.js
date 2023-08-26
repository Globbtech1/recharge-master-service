// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { buyAirtimeValidator } = require("../validations/airtime.validation");
const { buyDataValidator } = require("../validations/data.validation");
const {
  buyElectricityValidator,
  verifyMeterNumberValidator,
} = require("../validations/electricity.validation");
const {
  setSecurityNumberValidator,
  updateSecurityNumberValidator,
  changePasswordValidator,
} = require("../validations/transactions.validation");
const {
  fetchTvProviderBundlesValidator,
  fetchTvProviderProductTypeBundlesValidator,
  customerValidationValidator,
  tvSubscriptionValidator,
} = require("../validations/tv-subscription.validation");
const {
  buyAirtimeValidator: guestBuyAirtimeValidator,
} = require("../validations/guest-airtime.validation");
const {
  buyDataValidator: guestBuyDataValidator,
} = require("../validations/guest-data.validation");
const {
  buyElectricityValidator: guestBuyElectricityValidator,
  verifyMeterNumberValidator: verifyGuestMeterNumberValidator,
} = require("../validations/guest-electricity.validation");
const {
  fetchTvProviderBundlesValidator: guestFetchTvProviderBundlesValidator,
  fetchTvProviderProductTypeBundlesValidator:
    guestFetchTvProviderProductTypeBundlesValidator,
  customerValidationValidator: guestCustomerValidationValidator,
  tvSubscriptionValidator: guestTvSubscriptionValidator,
} = require("../validations/guest-tv-subscription.validation");
const {
  resetPasswordValidationSchema,
} = require("../validations/auth.validation");
const {
  validateAddProductSchema,
  validateAddProductListSchema,
} = require("../validations/product.validation");

// eslint-disable-next-line no-unused-vars

const validateSetSecurityNumberUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { error } = setSecurityNumberValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateUpdateSecurityNumberUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    // SendEmail
    const { error } = updateSecurityNumberValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateChangePasswordUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    // SendEmail
    const { error } = changePasswordValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyAirtimeUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = buyAirtimeValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyAirtimeGuestInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestBuyAirtimeValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyElectricityUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = buyElectricityValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyElectricityGuestInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestBuyElectricityValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateVerifyMeterNumberUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = verifyMeterNumberValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateVerifyGuestMeterNumberUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = verifyGuestMeterNumberValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyDataUserInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = buyDataValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateBuyDataGuestInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestBuyDataValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateTvProviderInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = fetchTvProviderBundlesValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateTvProviderProductTypeInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = fetchTvProviderProductTypeBundlesValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const customerValidationInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = customerValidationValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const tvSubValidationInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = tvSubscriptionValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

const validateGuestTvProviderInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestFetchTvProviderBundlesValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateGuestTvProviderProductTypeInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestFetchTvProviderProductTypeBundlesValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const guestCustomerValidationInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestCustomerValidationValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const guestTvSubValidationInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = guestTvSubscriptionValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateResetPasswordInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = resetPasswordValidationSchema(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateAddProductInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = validateAddProductSchema(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};
const validateAddProductListInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    const { error } = validateAddProductListSchema(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

module.exports = {
  validateSetSecurityNumberUserInput,
  validateUpdateSecurityNumberUserInput,
  validateChangePasswordUserInput,
  validateBuyAirtimeUserInput,
  validateBuyDataUserInput,
  validateBuyElectricityUserInput,
  validateVerifyMeterNumberUserInput,
  validateTvProviderInput,
  validateTvProviderProductTypeInput,
  customerValidationInput,
  tvSubValidationInput,
  validateBuyAirtimeGuestInput,
  validateBuyDataGuestInput,
  validateBuyElectricityGuestInput,
  validateVerifyGuestMeterNumberUserInput,
  validateGuestTvProviderInput,
  validateGuestTvProviderProductTypeInput,
  guestCustomerValidationInput,
  guestTvSubValidationInput,
  validateResetPasswordInput,
  validateAddProductInput,
  validateAddProductListInput,
};
