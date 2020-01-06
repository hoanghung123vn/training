var Member = require('../models/member');
var MemberFollow = require('../models/memberFollow');
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');
var response = require('../core/response');
const config = require('../../config')
const Utils = require('../core/utils')

module.exports.run = function (app, io) {
    app.post('/member/signup', [authenticate.checkApiSecretKey], function (req, res) {
        var userName = req.body.userName || '';
        var password = req.body.password || '';
        var email = userName;//req.body.email || '';
        if (userName == '' || password == '' || email == '') {
            res.send('missing parameter!');
        } else {
            Member.signUp(userName, password, req.body.fullName, req.body.mobile, email).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/member/signin', [authenticate.checkApiSecretKey], function (req, res) {
        var userName = req.body.userName || '';
        var password = req.body.password || '';
        var loginType = req.body.loginType || '';
        if (loginType == 'email') {
            if (userName == '' || password == '') {
                res.send(response.error('missing parameter!'));
            } else {
                Member.signIn(userName, password).then(function (msg) {
                    return res.jsonp(msg);
                }).catch(err => {
                    console.log(err);
                });
            }
        }

    });
    app.post('/member/email-exists', [authenticate.checkApiSecretKey], function (req, res) {
        var email = req.body.email || '';
        if (email == '') {
            res.send('missing parameter @email!');
        } else {
            Member.checkEmail(email).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/member/username-exists', [authenticate.checkApiSecretKey], function (req, res) {
        var userName = req.body.userName || '';
        if (userName == '') {
            res.send('missing parameter @userName!');
        } else {
            Member.checkUserName(userName).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/member/info', [authenticate.checkLogin], function (req, res) {
        var memberId = req.member.Id;
        Member.getById(memberId).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/member/update-profile', [authenticate.checkLogin], function (req, res) {
        var member = req.body;
        member.memberId = req.member.Id;
        Member.updateProfile(member).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/member/change-password', [authenticate.checkLogin], function (req, res) {
        var password = req.body.password || '';
        var newPassword = req.body.newPassword || '';
        var memberId = req.member.Id;
        if (password == '')
            res.send(response.error('missing parameter @password!'));
        else if (newPassword == '')
            res.send(response.error('missing parameter @new_password!'));
        else
            Member.changePassword(memberId, password, newPassword).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/member/new-password', [authenticate.checkLogin], function (req, res) {
        var password = req.body.password || '';
        var email = req.body.email || '';
        if (email == '')
            res.send(response.error('missing parameter @email!'));
        else if (password == '')
            res.send(response.error('missing parameter @password!'));
        else
            Member.newPassword(email, password).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/member/forgot-password', [authenticate.checkLogin], function (req, res) {
        var email = req.body.email || '';
        if (email == '')
            res.send(response.error('missing parameter @email!'));
        else
            Member.checkEmail(email).then(function (msg) {
                if (msg.message != '') {
                    var code = Utils.ramdomNumber(6);
                    Utils.sendMail(email, 'Lấy lại mật khẩu', code);
                    Member.updateVerifiedCode(email, code);
                    res.send(response.success(code));
                } else {
                    res.send(response.error('EmailNotFound'));
                }

            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/member/verified-code', [authenticate.checkLogin], function (req, res) {
        var code = req.body.code || '';
        var email = req.body.email || '';
        if (code == '' && email)
            res.send(response.error('missing parameter!'));
        else
            Member.verifiedCode(code).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/member/twitter/token', [authenticate.checkApiSecretKey], function (req, res) {
        var token = req.body.token || '';

        if (token == '') {

        } else {

        }

    });
    app.post('/member/signup-line', [authenticate.checkApiSecretKey], function (req, res) {
        var token = req.body.token || '';
        if (token == '') {
            res.send(response.error('missing parameter @token!'));
        } else {
            Utils.getLineUserByToken(token).then(function (msg) {
                console.log(msg);
                if (msg) {
                    Member.signLine(msg).then(function (msg2) {
                        return res.jsonp(msg2);
                    }).catch(err => {
                        return res.jsonp(err);
                    });
                }
            }).catch(err => {
                return res.jsonp(err);
            });
        }

    });

    app.post('/member/follow', [authenticate.checkLogin], function (req, res) {
        var authorId = req.body.authorId || 0;
        if (authorId == 0) {
            res.send(response.error('missing parameter @author_id!'));
        } else {
            MemberFollow.follow(authorId, req.member.Id).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/member/unfollow', [authenticate.checkLogin], function (req, res) {
        var authorId = req.body.authorId || 0;
        if (authorId == 0) {
            res.send(response.error('missing parameter @author_id!'));
        } else {
            MemberFollow.unFollow(authorId, req.member.Id).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}