const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = {
  sendMail: options => {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: process.env.AUTH_EMAIL,
              pass: process.env.AUTH_PASSWORD
          },
          tls: {
              rejectUnauthorized: false
          }
      });
      const text = htmlToText.fromString(options.html, {
        wordwrap: 130
      });

      // Message object
      let message = {
        from: `KickChat <${process.env.AUTH_EMAIL}>`,
        to: options.receiver,
        subject: options.subject,
        text,
        html: options.html
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err);
          return reject(err);
        }

        return resolve({
          message: 'Reset password link has been sent to your inbox'
        });
      });
    });
  }
};
