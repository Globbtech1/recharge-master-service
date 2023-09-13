const mailgun = require("mailgun-js")({
  apiKey: "25e05bf5740ddb803a36e1333b0ff413-b2f5ed24-d9536a99",
  domain: "mg.krib.ng",
});
const sgMail = require("@sendgrid/mail");

const SendEmailOld = async (Payloads, mailBody, subject = "Welcome Onboard") =>
  new Promise(async (resolve, reject) => {
    console.log(Payloads, "pppppppp>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    var data = {
      // from: "Smartrick <me@samples.mailgun.org>",
      from: "Maya from Noisystreetss <hello@noisystreetss.com>",
      // to: "hashdavies@gmail.com",
      to: Payloads.userEmail,
      // to: "tifeblakez1@gmail.com",
      bcc: "hashdavies@gmail.com",
      subject: subject,
      // text: "Testing some Mailgun awesomeness!",
      html: mailBody,
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body, "success mail");
      console.log(error, "errormail");
    });
    if (error) {
      reject(false);
    } else {
      resolve(true);
    }
  });

const SendEmail = async (Payloads, mailBody, subject = "Welcome Onboard") =>
  new Promise(async (resolve, reject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: Payloads.userEmail,
      from: {
        email: process.env.SENDGRID_FROM_MAIL,
        name: process.env.Email_FROM_NAME,
      }, // Use the email address or domain you verified above
      subject: subject,
      // text: "and easy to do anywhere, even with Node.js",
      html: mailBody,
      bcc: "hashdavies@gmail.com",
    };

    sgMail.send(msg).then(
      (response) => {
        console.log(response, "SendGrid response");
        resolve(true);
      },
      (error) => {
        console.error(error, "SendGrid");

        if (error.response) {
          console.error(error.response.body);
          reject(false);
        }
      }
    );

    // console.log(Payloads, "pppppppp>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // var data = {
    //   // from: "Smartrick <me@samples.mailgun.org>",
    //   from: "Maya from Noisystreetss <hello@noisystreetss.com>",
    //   // to: "hashdavies@gmail.com",
    //   to: Payloads.userEmail,
    //   // to: "tifeblakez1@gmail.com",
    //   bcc: "hashdavies@gmail.com",
    //   subject: subject,
    //   // text: "Testing some Mailgun awesomeness!",
    //   html: mailBody,
    // };

    // mailgun.messages().send(data, function (error, body) {
    //   console.log(body, "success mail");
    //   console.log(error, "errormail");
    // });
    // if (error) {
    //   reject(false);
    // } else {
    //   resolve(true);
    // }
  });

module.exports = { SendEmail };
