var Role = require('../../models/cms/role');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../../core/response');
var permission = require('../../middleware/permission');
var enumPer = require('../../../config/enum').Permission;

module.exports.run = function (app, io) {
    app.post('/cms/role/add', [authenticate.checkLogin], function (req, res) {
        var roleName = req.body.name || '';
        if (roleName == '') {
            res.send('missing parameter @name!');
        } else {
            Role.add(roleName).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/role/update', [authenticate.checkLogin], function (req, res) {
        var roleId = req.body.id || 0;
        var roleName = req.body.name || '';
        if (roleName == '' || roleId <= 0) {
            res.send('missing parameter!');
        } else {
            Role.update(roleId, roleName).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/role/list', [authenticate.checkLogin], function (req, res) {
        Role.getList().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/role/detail', [authenticate.checkLogin], function (req, res) {
        var roleId = req.body.id || 0;
        if (roleId <= 0) {
            res.send('missing parameter @id!');
        } else {
            Role.getById(roleId).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/role/update-permission', [authenticate.checkLogin], function (req, res) {
        var roleId = req.body.roleId || 0;
        var perIds = req.body.permissionIds || [];
        var isUpdateMember = req.body.isUpdateMember || false;
        if (roleId <= 0) {
            res.send(response.error('missing parameter @roleId!'));
        } else {
            Role.addPermission(roleId, perIds, isUpdateMember).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/role/permission-list-add', [authenticate.checkLogin], [permission.check(enumPer.UserManagement)], function (req, res) {
        var roleId = req.body.roleId || 0;
        if (roleId <= 0) {
            res.send(response.error('missing parameter @roleId!'));
        } else {
            Role.getPermissionByAdd(roleId).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
}