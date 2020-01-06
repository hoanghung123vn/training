var Member = require('../../models/cms/member');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../../core/response');
var permission = require('../../middleware/permission');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/member/detail', [authenticate.checkLogin],[permission.check(enumPer.MemberManagement)], function (req, res) {
        var memberId = req.body.member_id;
        Member.getById(memberId).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/member/search', [authenticate.checkLogin],[permission.check(enumPer.MemberManagement)], function (req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var status = req.body.status || 0;
        var keyword = req.body.keyword || '';
        Member.search(keyword, status, pageIndex, pageSize).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/member/change-status', [authenticate.checkLogin],[permission.check(enumPer.MemberManagement)], function (req, res) {
        var memberId = req.body.memberId;
        var status = req.body.status;
        Member.changeStatus(memberId, status).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/member/reset-password', [authenticate.checkLogin],[permission.check(enumPer.MemberManagement)], function (req, res) {
        var password = req.body.password || '';
        var memberId = req.body.memberId || 0;
        if (memberId <= 0)
            res.send(response.error('missing parameter @member_id!'));
        else if (password == '')
            res.send(response.error('missing parameter @password!'));
        else
            Member.resetPassword(memberId, password).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
    });
}