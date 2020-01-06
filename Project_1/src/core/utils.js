const config = require('../../config'),
    cache = require('memory-cache'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.EncryptKey),
    sql = require('mssql'),
    keysToCamelcase = require('keys-to-camelcase'),
    _ = require('lodash'),
    request = require('request'),
    nodemailer = require('nodemailer');

var mailServer = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

var timeOut = 24 * 60 * 1000;

const camelizeKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(v => camelizeKeys(v));
    } else if (obj !== null && obj != undefined && obj.constructor === Object) {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [_.camelCase(key)]: camelizeKeys(obj[key]),
        }),
        {},
      );
    }
    return obj;
  };

module.exports = {
    addCache(cacheKey, data, time) {
        if (!time)
            time = timeOut;
        return cache.put(cacheKey, data, time);
    },
    getCache(cacheKey) {
        return cache.get(cacheKey);
    },
    removeCache(cacheKey) {
        return cache.del(cacheKey);
    },
    removeAllCache() {
        return cache.clear();
    },
    encrypt(text) {
        return cryptr.encrypt(text);
    },
    decrypt(cryptrText) {
        return cryptr.decrypt(cryptrText)
    },
    camelCase(data) {
        if (data)
            return keysToCamelcase(data);
        return null;
    },
    getLineUserByToken(token) {
        return new Promise((resolve, reject) => {
            request({
                url: config.line.apiUrl,
                json: true,
                headers: {
                    "Authorization": 'Bearer ' + token
                }
            }, function (err, res, body) {
                if (res.statusCode != 200)
                    return reject(err);
                return resolve(body);
            });
        });
    },
    camelizeKeys: camelizeKeys,
    sendMail(to, subject, body) {
        var mailOptions = {
            from: 'Amela Fukuon',
            to: to,
            subject: subject,
            html: body
        };

        mailServer.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    ramdomNumber(length) {
        var chars = [..."0123456789"];
        return [...Array(length || 6)].map(i => chars[Math.random() * chars.length | 0]).join``;
    }
}