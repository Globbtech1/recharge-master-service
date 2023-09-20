const VerificationMailBodyContent = (data) =>
  new Promise((resolve) => {
    // let transcode = `${data.transactionId}.pdf`;
    const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .wrapper {
        background: #e5e5e5;
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        /* height: 100vh; */
      }
      .Logo {
        width: 200px;
        padding: 5px 30px;
      }
      .container {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        position: relative;
      }

      table {
        font-size: 16px;
      }

      td {
        text-align: left;
        margin: 20px 0;
        padding: 20px 0;
      }

      .btn {
        padding: 17px 20px;
        background: rgb(0, 174, 255);
        color: white;
        font-size: 15px;
        border: 1px;
        width: 300px;
        max-width: 80%;
        border-radius: 10px;
      }
      .footer {
        padding: 1rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #edf8ff;
      }
      .footer div i {
        margin: 0 5px;
      }

      .top {
        position: absolute;
        top: -2px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .top span {
        width: 200px;
        height: 3px;
        background: blue;
        flex: 1;
      }
      .top span:nth-child(1) {
        background: yellow;
      }
      .top span:nth-child(2) {
        background: blue;
      }
      .top span:nth-child(3) {
        background: green;
      }

      @media (min-width: 360px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 768px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 992px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 1200px) {
        .container {
          width: 750px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-size: 15px">
    <div class="wrapper">
      <div class="container">
        <table style="width: 100%; margin: 10px; position: relative">
    
        </table>
        <div
          style="
            background: #fff;
            padding: 2rem 2rem;
            width: 100%;
            position: relative;
          "
        >
          <div class="top">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <table style="width: 100%">
              <tr style="padding-top: 2rem">
                <td>Hello ${data.customerName},</td>
              </tr>

              <tr>
                <td>
                Congratulations!
                 we welcome you to recharge master . A platform where you can do all your bills payment.
                </td>
                 
              </tr>
              <tr>
              <td>
             
              </td>
             
            </tr>

                
            </table>
          </div>
        </div>
     
      </div>
    </div>
  </body>
</html>`;
    console.log(html);
    resolve(html);
  });
const ChangeUserEmail = (data) =>
  new Promise((resolve) => {
    // let transcode = `${data.transactionId}.pdf`;
    const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .wrapper {
        background: #e5e5e5;
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        /* height: 100vh; */
      }
      .Logo {
        width: 200px;
        padding: 5px 30px;
      }
      .container {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        position: relative;
      }

      table {
        font-size: 16px;
      }

      td {
        text-align: left;
        margin: 20px 0;
        padding: 20px 0;
      }

      .btn {
        padding: 17px 20px;
        background: rgb(0, 174, 255);
        color: white;
        font-size: 15px;
        border: 1px;
        width: 300px;
        max-width: 80%;
        border-radius: 10px;
      }
      .footer {
        padding: 1rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #edf8ff;
      }
      .footer div i {
        margin: 0 5px;
      }

      .top {
        position: absolute;
        top: -2px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .top span {
        width: 200px;
        height: 3px;
        background: blue;
        flex: 1;
      }
      .top span:nth-child(1) {
        background: yellow;
      }
      .top span:nth-child(2) {
        background: blue;
      }
      .top span:nth-child(3) {
        background: green;
      }

      @media (min-width: 360px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 768px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 992px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 1200px) {
        .container {
          width: 750px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-size: 15px">
    <div class="wrapper">
      <div class="container">
        <table style="width: 100%; margin: 10px; position: relative">
    
        </table>
        <div
          style="
            background: #fff;
            padding: 2rem 2rem;
            width: 100%;
            position: relative;
          "
        >
          <div class="top">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <table style="width: 100%">
              <tr style="padding-top: 2rem">
                <td>Hello ${data.customerName},</td>
              </tr>

              <tr>
                <td>
               We got a request to change your email address from  ${data.customerEmail} to ${data.newEmail}.  
                </td>
                 
              </tr>
              <tr>
              <td>
              <p>   Use this code to verify  your account, <strong>- ( ${data.verificationCode}) </strong></p>
              </td>
              <td>
              <p>  Please contact us if you do not initiate  this request </p>
              </td>
             
            </tr>

                
            </table>
          </div>
        </div>
     
      </div>
    </div>
  </body>
</html>`;
    console.log(html);
    resolve(html);
  });
const ResetPasswordMailBodyContent = (data) =>
  new Promise((resolve) => {
    // let transcode = `${data.transactionId}.pdf`;
    let html = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Payment</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .wrapper {
              background: #e5e5e5;
              padding-top: 2rem;
              padding-bottom: 2rem;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              position: relative;
              /* height: 100vh; */
            }
            .Logo {
              width: 200px;
              padding: 5px 30px;
            }
            .container {
              padding-right: 15px;
              padding-left: 15px;
              margin-right: auto;
              margin-left: auto;
              position: relative;
            }

            table {
              font-size: 16px;
            }

            td {
              text-align: left;
              margin: 20px 0;
              padding: 20px 0;
            }

            .btn {
              padding: 17px 20px;
              background: rgb(0, 174, 255);
              color: white;
              font-size: 15px;
              border: 1px;
              width: 300px;
              max-width: 80%;
              border-radius: 10px;
            }
            .footer {
              padding: 1rem 1rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #edf8ff;
            }
            .footer div i {
              margin: 0 5px;
            }

            .top {
              position: absolute;
              top: -2px;
              left: 0;
              width: 100%;
              display: flex;
              justify-content: center;
            }

            .top span {
              width: 200px;
              height: 3px;
              background: blue;
              flex: 1;
            }
            .top span:nth-child(1) {
              background: yellow;
            }
            .top span:nth-child(2) {
              background: blue;
            }
            .top span:nth-child(3) {
              background: green;
            }

            @media (min-width: 360px) {
              .container {
                width: 90%;
              }
            }
            @media (min-width: 768px) {
              .container {
                width: 90%;
              }
            }
            @media (min-width: 992px) {
              .container {
                width: 90%;
              }
            }
            @media (min-width: 1200px) {
              .container {
                width: 750px;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-size: 15px">
          <div class="wrapper">
            <div class="container">
              <table style="width: 100%; margin: 10px; position: relative">
          
              </table>
              <div
                style="
                  background: #fff;
                  padding: 2rem 2rem;
                  width: 100%;
                  position: relative;
                "
              >
                <div class="top">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div>
                  <table style="width: 100%">
                    <tr style="padding-top: 2rem">
                      <td>Hello there,</td>
                    </tr>

                    <tr>
                      <td>
                    We just received a request from you to reset your login password
                      </td>
                      
                    </tr>
                    <tr>
                    <td>
                    <p>  please kindly use this code  - ( ${data?.contentData?.code}) to reset your login details </p>
                    </td>
                  
                  </tr>

                    <tr>
                      <td>
                      <p> if this request did not come from you. Kindly let us know by emailing us at  
                      ${process.env.SUPPORT_EMAIL}
                      </td>
                    </tr>
              
                


                            
                  </table>
                </div>
              </div>
          
            </div>
          </div>
        </body>
      </html>

    `;
    // console.log(html);
    resolve(html);
  });

const TransactionNotificationContent = (data) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .wrapper {
        background: #e5e5e5;
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        /* height: 100vh; */
      }
      .Logo {
        width: 200px;
        padding: 5px 30px;
      }
      .container {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        position: relative;
      }

      table {
        font-size: 16px;
      }

      td {
        text-align: left;
        margin: 20px 0;
        padding: 20px 0;
      }

      .btn {
        padding: 17px 20px;
        background: rgb(0, 174, 255);
        color: white;
        font-size: 15px;
        border: 1px;
        width: 300px;
        max-width: 80%;
        border-radius: 10px;
      }
      .footer {
        padding: 1rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #edf8ff;
      }
      .footer div i {
        margin: 0 5px;
      }

      .top {
        position: absolute;
        top: -2px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .top span {
        width: 200px;
        height: 3px;
        background: blue;
        flex: 1;
      }
      .top span:nth-child(1) {
        background: yellow;
      }
      .top span:nth-child(2) {
        background: blue;
      }
      .top span:nth-child(3) {
        background: green;
      }

      @media (min-width: 360px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 768px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 992px) {
        .container {
          width: 90%;
        }
      }
      @media (min-width: 1200px) {
        .container {
          width: 750px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-size: 15px">
    <div class="wrapper">
      <div class="container">
        <table style="width: 100%; margin: 10px; position: relative">
    
        </table>
        <div
          style="
            background: #fff;
            padding: 2rem 2rem;
            width: 100%;
            position: relative;
          "
        >
          <div class="top">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <table style="width: 100%">
              <tr style="padding-top: 2rem">
                <td>Hello ${data.customerName},</td>
              </tr>

              <tr>
                <td>
              We got a request to change your email address from  ${data.customerEmail} to ${data.newEmail}.  
                </td>
                
              </tr>
              <tr>
              <td>
              <p>   Use this code to verify  your account, <strong>- ( ${data.verificationCode}) </strong></p>
              </td>
              <td>
              <p>  Please contact us if you do not initiate  this request </p>
              </td>
            
            </tr>

                
            </table>
          </div>
        </div>
    
      </div>
    </div>
  </body>
  </html>`;
  resolve(html);
};
const EmailVerificationContent = (data) => {
  let token = data?.contentData?.token;
  const verificationLink = `https://rechargemaster.com/email-verification?token=${token}`;
  const mailBody = `Click the link below to verify your email:\n\n${verificationLink}, 
                        <p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>`;

  return mailBody;
};
module.exports = {
  VerificationMailBodyContent,
  ChangeUserEmail,
  ResetPasswordMailBodyContent,
  TransactionNotificationContent,
  EmailVerificationContent,
};
