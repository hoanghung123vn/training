var Tag = require('../../models/cms/tag');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var permission = require('../../middleware/permission');
var response = require('../../core/response');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/tag/detail', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var id = req.body.id || 0;
        if (id <= 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Tag.getById(id).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/tag/search', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var pageIndex = req.body.pageIndex || 1;
        var pageSize = req.body.pageSize || 10;
        var status = req.body.status;
        var postId = req.body.postId || -1;
        var keyword = req.body.keyword || '';
        Tag.search(postId, status, keyword, pageIndex, pageSize).then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/tag/update', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var Id = req.body.id || 0;
        var Name = req.body.name || '';
        if (Id <= 0 || Name == '') {
            res.send(response.error('missing parameter!'));
        } else {
            Tag.update(Id, Name).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/tag/add', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var Name = req.body.name || '';
        var CreatedBy = req.member.Id;
        if (Name == '') {
            res.send(response.error('missing parameter!'));
        } else {
            Tag.insert(Name, CreatedBy).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
 
    app.post('/cms/tag/remove', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var Id = req.body.id || 0;
        var status = 0;
        if (Id == 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Tag.changeStatus(Id, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/tag/publish', [authenticate.checkLogin], [permission.check(enumPer.Tag)], function (req, res) {
        var Id = req.body.id || 0;
        var status = 1;
        if (Id == 0) {
            res.send(response.error('missing parameter @id!'));
        } else {
            Tag.changeStatus(Id, status).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}