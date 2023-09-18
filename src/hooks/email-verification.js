// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest } = require("@feathersjs/errors");
const { SendEmail } = require("../dependency/commonRequest");
const { verifyUserEmailValidator } = require("../validations/auth.validation");

const validateEmailInput = (options = {}) => {
  return async (context) => {
    const { data } = context;
    console.log(data, "data");
    const { error } = verifyUserEmailValidator(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return context;
  };
};

const sendVerificationEmail = (options = {}) => {
  return async (context) => {
      const { app, data } = context
      const token = crypto.randomBytes(20).toString("hex")
      const now = new Date()
      const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24hours
      const user = await app.service("users").find({ query: { email: data.mail } })
    
      if (!user || user.length === 0) {
        throw new BadRequest("User not found");
      }
    
      await app.service("email-verification").create({
        token,
        userId: user[0].id,
        expiredAt: expirationDate,
        type: "email"         // 'type' field to distinguish email verification
      })
    
      const verificationLink = `https://rechargemaster.com/email-verification?token=${token}`;
      
      const mailBody =  ```Click the link below to verify your email:\n\n${verificationLink}, 
                        <p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>```
    
      const subject = "Email Verification"
    
      await SendEmail(data.email, mailBody, subject);
        
      context.result = { sent: true }
      return context;
  }
}

module.exports = { sendVerificationEmail, validateEmailInput };
