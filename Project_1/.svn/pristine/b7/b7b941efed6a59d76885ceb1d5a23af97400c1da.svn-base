var User = require('../../models/cms/user');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../../core/response');
var Captcha = require('../../core/captcha');
var Utils = require('../../core/utils');
var permission = require('../../middleware/permission');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/user/add', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var userName = req.body.user_name || '';
        var password = req.body.password || '';
        var email = req.body.email || '';
        var roleId = req.body.role_id || '';
        if (userName == '' || password == '' || email == '' || roleId <= 0) {
            res.send('missing parameter!');
        } else {
            User.add(userName, password, req.body.full_name, req.body.mobile, email, roleId).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/user/get_captcha', [authenticate.checkApiSecretKey], function (req, res) {
        return res.jsonp(Captcha.create());
    });
    app.post('/cms/user/login', [authenticate.checkApiSecretKey], function (req, res) {
        var userName = req.body.username || '';
        var password = req.body.password || '';
        var captcha = req.body.captcha || '';
        var md5Captcha = req.body.md5Captcha || '';
        console.log(req.body)
        if (userName == '' || password == '' || captcha == '' || md5Captcha == '') {
            res.send(response.error('missing parameter!'));
        }
        else if(Utils.decrypt(md5Captcha) != captcha){
            res.send(response.error('captcha incorrect!'));
        }
         else {
            User.login(userName, password).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/user/save', [authenticate.checkLogin], function (req, res) {
        User.updateProfile(req.body).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/user/change-password', [authenticate.checkLogin], function (req, res) {
        var password = req.body.password || '';
        var newPassword = req.body.new_password || '';
        var userId = req.member.Id;
        if (password == '')
            res.send(response.error('missing parameter @password!'));
        else if (newPassword == '')
            res.send(response.error('missing parameter @new_password!'));
        else
            User.changePassword(userId, password, newPassword).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/cms/user/reset-password', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var password = req.body.password || '';
        var userId = req.body.userId || 0;
        if (password == '' && userId <= 0)
            res.send(response.error('missing parameter @password!'));
        else
            User.resetPassword(userId, password).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
    app.post('/cms/user/update-permission', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var userId = req.body.userId || 0;
        var roleId = req.body.roleId || 0;
        var perIds = req.body.permissionIds || [];
        if (userId <= 0) {
            res.send(response.error('missing parameter @userId!'));
        } else {
            User.addPermission(userId, roleId, perIds).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/user/list-permission', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var userId = req.body.user_id || 0;
        if (userId <= 0) {
            res.send(response.error('missing parameter @user_id!'));
        } else {
            User.getPermission(userId).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/user/permission-list-add', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var userId = req.body.userId || 0;
        if (userId <= 0) {
            res.send(response.error('missing parameter @user_id!'));
        } else {
            User.getPermissionByAdd(userId).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/user/detail', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var memberId = req.body.id;
        User.getById(memberId).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/user/search', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var status = req.body.status || 10;
        var keyword = req.body.keyword || '';
        User.search(keyword, status, pageIndex, pageSize).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });

}