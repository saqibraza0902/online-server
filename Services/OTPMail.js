const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer');
const OTPmailer = (email, otp) => {
    var transport = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        port: 465,
        host: 'smtp.gmail.com',
        secureConnection: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    }))
    var mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Your OTP for SignIN',
        text: otp
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email Sent at ' + email);
        }
    });
}
module.exports = OTPmailer