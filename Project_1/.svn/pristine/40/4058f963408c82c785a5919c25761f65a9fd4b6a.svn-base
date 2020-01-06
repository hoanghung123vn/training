var Post = require('../models/post');
var PostLike = require('../models/postLike');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../core/response');
var MediaApi = require('../core/mediaApi');
const config = require('../../config')

module.exports.run = function(app, io) {
    app.post('/post/detail', [authenticate.checkApiSecretKey], function(req, res) {
        var id = req.body.id || 0;
        if (id <= 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Post.getById(id).then(function(msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/post/search', [authenticate.checkApiSecretKey], function(req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var zoneId = req.body.zone_id || 10;
        var status = req.body.status || '';
        var keyword = req.body.keyword || '';
        var memberId = 0;
        if (req.member)
            memberId = req.member.Id;
        Post.search(memberId, keyword, zoneId, status, pageIndex, pageSize).then(function(msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/post/list-by-member', [authenticate.checkLogin], function(req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        Post.getListByMember(req.member.Id, pageIndex, pageSize).then(function(msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/post/like', [authenticate.checkLogin], function(req, res) {
        var postId = req.body.postId || 0;
        if (postId == 0) {
            res.send(response.error('missing parameter @postId!'));
        } else {
            PostLike.like(postId, req.member.Id).then(function(msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/post/unlike', [authenticate.checkLogin], function(req, res) {
        var postId = req.body.postId || 0;
        if (postId == 0) {
            res.send(response.error('missing parameter @postId!'));
        } else {
            PostLike.unLike(postId, req.member.Id).then(function(msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/post/add', [authenticate.checkLogin], function (req, res) {
        var memberId = req.member.Id;
        var title = req.body.title || '';
        var description = req.body.description;
        if (title =='') {
            res.send(response.error('missing parameter @title!'));
        } else {
            Post.add(title, description, memberId).then(function (msg) {
                var postId = msg.data;
                MediaApi.getLiveName(postId).then(function (msg2) {
                    if (msg2) {
                        var path = config.mediaApi.playUrl + msg2.play_url;
                        Post.updatePath(postId, path, msg2.stream_key).then(function (msg3) {
                            console.log(msg3);
                            return res.jsonp(response.success({ streamKey: msg2.stream_key, playUrl: path }));
                        }).catch(err => {
                            return res.jsonp(err);
                        });
                    }
                }).catch(err => {
                    return res.jsonp(err);
                });
            }).catch(err => {
                console.log(err);
                return res.jsonp(err);
            });
        }
        
    });
}