const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(verificationCode, user) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const msg = {
    from: 'admin@mydiaryapp.com', // Sender address
    // to: `${user.email}`, // you can aslo send to alist of users
    to: 'vicorandyrichard26@gmail.com', // you can aslo send to alist of users
    subject: 'MY DIARY APP',
    html: `<h2 style="color:#ff6600;">Hi ${user.firstname}, Your verification code is</h2> <p style="color:green;">${verificationCode}<p>`,
  };

  transporter.sendMail(msg);
}

module.exports = { sendEmail };
