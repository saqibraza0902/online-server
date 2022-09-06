const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer');
const mailer = (email, url) => {
    // var transporter = nodemailer.createTransport({
    //     smtpTransport({
    //     service: "gmail",
    //     port: 587,
    //     secureConnection: false,
    //     auth: {
    //         user: process.env.USER,
    //         pass: process.env.PASS
    //         }
    //     })
    //  } );
    var transport = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        port: 587,
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
        html: `<a href="${url}">Verify your email</a>`
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        }
        console.log('Email Sent at ' + email);
    });
}
module.exports = mailer