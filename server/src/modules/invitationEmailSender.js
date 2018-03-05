let nodemailer = require('nodemailer');
let configuration = require('../../configuration.js');

function sendInvitationEmail(emailAddress, generatedPassword) {
  let transporter = nodemailer.createTransport(configuration.email);

  let mailOptions = {
    from: 'sourceaddress@example.com',
    to: emailAddress,
    subject: 'Welcome to the app',
    text: `Welcome to the app, ${emailAddress}!  Your password is ${generatedPassword}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

module.exports = sendInvitationEmail;
