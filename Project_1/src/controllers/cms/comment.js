var Comment = require('../../models/cms/comment');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var permission = require('../../middleware/permission');
var response = require('../../core/response');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/comment/detail', [authenticate.checkLogin], [permission.check(enumPer.Comment)], function (req, res) {
        var id = req.body.id || 0;
        if (id <= 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Comment.getById(id).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/comment/search', [authenticate.checkLogin], [permission.check(enumPer.Comment)], function (req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var status = req.body.status;
        var postId = req.body.postId || -1;
        var keyword = req.body.keyword || '';
        Comment.search(postId, status, keyword, pageIndex, pageSize).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
 
    app.post('/cms/comment/remove', [authenticate.checkLogin], [permission.check(enumPer.Comment)], function (req, res) {
        var Id = req.body.id || 0;
        var status = 0;
        if (Id == 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Comment.changeStatus(Id, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/comment/publish', [authenticate.checkLogin], [permission.check(enumPer.Comment)], function (req, res) {
        var Id = req.body.id || 0;
        var status = 1;
        if (Id == 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Comment.changeStatus(Id, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}