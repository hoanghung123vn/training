var Comment = require('../models/comment');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../core/response');

module.exports.run = (app, io) => {
    app.post('/comment/add', [authenticate.checkLogin], (req, res) => {
        var comment = req.body;
        if (comment) {
            commentPost = {
                postId: comment.postId,
                memberId: req.member.Id,
                parentId: comment.parentId,
                content: comment.content
            }
            Comment.insert(commentPost).then((msg) => {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });

    app.post('/comment/remove', [authenticate.checkLogin], (req, res) => {
        var commentId = req.body.id || 0;
        var memberId = req.member.Id || 0;
        var comment = Comment.getById(commentId);
        comment.then(comment => {
            if (commentId <= 0 || memberId <= 0) {
                res.send(response.error('missing parameter @commentId, @memberId!'));
            } else if (memberId != comment.data.memberId) {
                res.send(response.error('you do not have permission!'));
            } else {
                Comment.remove(commentId).then((msg) => {
                    return res.jsonp(msg);
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    });

    app.post('/comment/edit', [authenticate.checkLogin], (req, res) => {
        var commentId = req.body.id || 0;
        var memberId = req.member.Id || 0;
        var newContent = req.body.content;
        var comment = Comment.getById(commentId);
        comment.then(comment => {
            if (commentId <= 0 || memberId <= 0) {
                res.send(response.error('missing parameter @commmentId, @memberId!'));
            } else if (memberId != comment.data.memberId) {
                res.send(response.error('you do not have permission!'))
            } else {
                Comment.update(commentId, newContent).then((msg) => {
                    return res.jsonp(msg);
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    });

    app.post('/comment/search', [authenticate.checkApiSecretKey], (req, res) => {
        var postId = req.body.postId || 0;
        var pageSize = req.body.pageSize || 10;
        var pageIndex = req.body.pageIndex || 1;
        if (postId <= 0) {
            res.send(response.error('missing parameter @postId!'));
        } else {
            Comment.getCommentsByPostId(postId, pageSize, pageIndex).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });

    app.post('/comment/children', [authenticate.checkApiSecretKey], (req, res) => {
        var ParentId = req.body.parentId || 0;
        var pageSize = req.body.pageSize || 10;
        var pageIndex = req.body.pageIndex || 1;
        if (parentId <= 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Comment.getCommentsByParentId(parentId, pageSize, pageIndex).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}
