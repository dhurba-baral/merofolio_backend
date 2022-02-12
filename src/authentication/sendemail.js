const nodemailer = require('nodemailer');
require('dotenv').config();

//create reusable transporter object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendMailForForgotPassword = async (email,subject,text) => {
    await transporter.sendMail(
        {
        from: '"Merofolio" <merofoliominor.gmail.com>',
        to: email,
        subject: subject,
        text: text,
    },
    (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response);
        }
    }
    );
};

module.exports = sendMailForForgotPassword;