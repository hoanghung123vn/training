const nodemailer = require('nodemailer');
var config = require('../../config');
var account = config.email;

var transporter = nodemailer.createTransport({
    host: account.host,
    port: account.port,
    secure: false,
    auth: {
        user: account.user,
        pass: account.pass
    }
});

module.exports.send = function(opts) {
    try {
        let mailOptions = {
            from: account.name,
            to: opts.to,
            subject: opts.title,
            html: opts.body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                if (typeof(opts.callback)) callback(error);
            }
            if (typeof(opts.callback)) callback(info);
        });
    } catch (e) {
        console.log(e);
    }
};