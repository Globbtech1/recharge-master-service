const { MailtrapClient } = require("mailtrap");

// Initialize your Mailtrap client with your API token
// const client = new MailtrapClient({ token: "TOKEN" });
const client = new MailtrapClient({ token: process.env.MAILTRAP_API_KEY });
exports.EmailService = class EmailService {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    const { receiverEmail, emailContent, subject, bccEmails } = data;

    try {
      // Specify the sender email address and name
      const sender = {
        email: process.env.FROM_EMAIL_MAIL,
        // email: "no-reply@globbtech.com",
        name: process.env.Email_FROM_NAME || "",
      };

      const recipient = { email: receiverEmail };
      // Specify the BCC recipients
      // const bccRecipients = (bccEmails || []).map((email) => ({ email }));
      const bccEmailsString = process.env.BCC_EMAILS || "";

      const bccEmails = bccEmailsString
        .split(",")
        .map((email) => ({ email: email.trim() }));

      // Construct the email message
      const message = {
        from: sender,
        to: [recipient],
        subject: subject,
        html: emailContent,
        // bcc: bccEmails,
        bcc: bccEmails,
      };

      // Send the email using Mailtrap
      const response = await client.send(message);
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      return { error: "Email sending failed" };
    }
  }
};
