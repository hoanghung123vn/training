var Post = require('../../models/cms/post');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var permission = require('../../middleware/permission');
var response = require('../../core/response');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/post/detail', [authenticate.checkLogin],[permission.check(enumPer.Post)], function (req, res) {
        var id = req.body.id || 0;
        if (id <= 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Post.getById(id).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/post/search', [authenticate.checkLogin],[permission.check(enumPer.Post)], function (req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var zoneId = req.body.zoneId || 10;
        var isShow = req.body.isShow;
        var memberId = req.body.memberId || -1;
        var status = req.body.status || -1;
        var keyword = req.body.keyword || '';
        Post.search(memberId, keyword, zoneId,status,isShow, pageIndex, pageSize).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
 
    app.post('/cms/post/remove', [authenticate.checkLogin],[permission.check(enumPer.Post)], function (req, res) {
        var postId = req.body.postId || 0;
        var status = false;
        if (postId == 0) {
            res.send(response.error('missing parameter @postId!'));
        } else {
            Post.changeIsShow(postId, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/post/publish', [authenticate.checkLogin], [permission.check(enumPer.Post)], function (req, res) {
        var postId = req.body.postId || 0;
        var status = true;
        if (postId == 0) {
            res.send(response.error('missing parameter @postId!'));
        } else {
            Post.changeIsShow(postId, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}