var config = require('../../config');
var jwt = require('jsonwebtoken');
var chatTokenSecretkey = '1234567890000987654321';
module.exports = {
    getSecretKey: function (userId) {
        return config.security.token_secret_key + '_' + userId;
    },
    checkGetTokenSecretKey: function (req, res, next) {
        var secret_key = req.query.secret_key || '';
        if (secret_key == config.security.get_token_secret_key) {
            next();
        } else if (secret_key == '') {
            res.send('missing parameter secret_key!');
        } else {
            res.send('parameter secret_key wrong!');
        }
    },
    checkApiSecretKey: function (req, res, next) {
        var secret_key = req.headers.secret_key || '';
        if (secret_key == '') secret_key = req.body.secret_key || '';
        if (secret_key == '') secret_key = req.body.secret_key || '';
        if (secret_key == config.security.api_secret_key){
            //var token = req.headers.token || '';
            //if (token == '') token = req.query.token || '';
            //if (token == '') token = req.body.token || '';
            //if (token != '') {
            //    req.token = token;
            //    var decoded = jwt.verify(token, config.security.get_token_secret_key);
            //    if (decoded)
            //        req.member = decoded;
            //} 
            next();
        }
        else
            res.send('parameter secret_key wrong!');
    },
    checkChatToken: function (req, res, next) {
        var token = req.query.token || '';
        if (token == '') token = req.body.token || '';

        if (token == '') {
            //test
            //token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAwMTUiLCJuYW1lIjoiR-G6pXUgVMO6IiwiYXZhdGFyIjoiaHR0cHM6Ly9zdG9yYWdlLmRla2lydS52bi9EYXRhLzIwMTcvMDUvMDUvYW5vbnltb3VzLTUxMjYzNjI5NTkzNjY2MDgyNDk0NS5wbmciLCJpYXQiOjE0OTQ4MzE5MTd9.zo2JWAHrscKVoXgfSUoUElNdn16Y6PHDMmU9MKjjgLs';
            //token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAwMTYiLCJuYW1lIjoiVGVzdCB1c2VyIiwiYXZhdGFyIjoiaHR0cHM6Ly9zdG9yYWdlLmRla2lydS52bi9EYXRhLzIwMTcvMDUvMDUvYW5vbnltb3VzLTUxMjYzNjI5NTkzNjY2MDgyNDk0NS5wbmciLCJjb21wYW55X2lkIjoiMSIsImlhdCI6MTQ5NDgzNDg1Mn0.xYqpEoNRFCKefrvP7ArpZzuFy-q8TuOWiD46n4noRRQ';
        }
        if (token != '') {
            req.token = token;
            var decoded = jwt.verify(token, chatTokenSecretkey);
            try {
                decoded.avatar = decodeURIComponent(decoded.avatar);
            } catch (e) {

            }
            req.member = decoded;
            //console.log('chat token', decoded);
            next();
        } else
            res.sendStatus(503);
    },
    checkLogin: function (req, res, next) {
        var secret_key = req.headers.secret_key || '';
        if (secret_key == '') secret_key = req.query.secret_key || '';
        if (secret_key == '') secret_key = req.body.secret_key || '';
        if (secret_key == config.security.api_secret_key) {
            var token = req.headers.token || '';
            if (token == '') token = req.query.token || '';
            if (token == '') token = req.body.token || '';
            if (token != '') {
                req.token = token;
                var decoded = jwt.verify(token, config.security.get_token_secret_key);
                if (!decoded)
                    res.sendStatus(503);
                else {
                    req.member = decoded;
                    next();
                }
            } else
                res.sendStatus(503);
        } else
            res.send('parameter secret_key wrong!');

    },
    checkPermission: function (per, res) {
        res.sendStatus(503);

    },
    chatTokenSecretkey: chatTokenSecretkey
}