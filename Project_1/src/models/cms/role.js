'use strict';
const config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.EncryptKey),
    response = require('../../core/response');
var jwt = require('jsonwebtoken');

class Role {
    constructor() {

    }
    getById(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.query('Select * from [Role] where id = @Id').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success(result.recordset[0]));
                    } else {
                        return reject(new Error('Role not found or not active!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getList() {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.query('Select * from [Role]').then(result => {
                    return resolve(response.success(result.recordset));
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }

    add(roleName) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('RoleName', sql.NVarChar(250), roleName);
                request.query('Insert into [Role](RoleName) values(@RoleName)').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success());
                    } else {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }

    update(id, roleName) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.input('RoleName', sql.NVarChar(250), roleName);
                request.query('Update [Role] Set RoleName = @RoleName Where Id = @Id').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success());
                    } else {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    remove(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.query('Delete [Role] Where Id = @Id And IsSystem != 1').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success());
                    } else {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    addPermission(roleId, permissionIds, isUpdateMember) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('RoleId', sql.Int, roleId);
                var queryStr = 'Delete RolePermission Where RoleId = @RoleId;';
                var param = '';
                var forCount = 0;
                console.log(permissionIds)
                if (typeof (permissionIds) == 'string')
                    permissionIds = JSON.parse(permissionIds);

                if (permissionIds.length > 0) {
                    permissionIds.forEach(item => {
                        request.input('PerId' + forCount, sql.Int, item);
                        if (param != '')
                            param += ',';
                        param += `(@RoleId, @PerId` + forCount + `)`
                        forCount++;
                    });
                    queryStr += ' Insert Into [RolePermission] (RoleId, PermissionId) Values ' + param;
                }
                if (isUpdateMember) {
                    queryStr += ' Delete UserPermission Where Exists(Select PermissionId From RolePermission Where RoleId = @RoleId And UserPermission.PermissionId = RolePermission.PermissionId);'
                    queryStr += ` Insert Into UserPermission(UserId, PermissionId) 
                              Select u.Id, PermissionId From [User] u
                              Inner Join RolePermission r on u.roleId = r.roleId 
                              Where r.roleId = @RoleId`
                }

                request.query(queryStr).then(result => {
                    return resolve(response.success());
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getPermissionByAdd(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('RoleId', sql.Int, id);
                var queryStr = `Select * From PermissionGroup;
                            Select p.id, p.name, p.groupId, ISNULL(u.PermissionId, 0) isExists From Permission AS p
                            Left join RolePermission u on u.PermissionId = p.Id and RoleId = @RoleId`;
                request.query(queryStr).then(result => {
                    var group = result.recordsets[0];
                    var permission = result.recordsets[1];
                    if (group.length > 0) {
                        group.forEach(item => {
                            item.Permissions = permission.filter(k => k.groupId == item.Id);
                        })
                    }
                    return resolve(response.success(group));
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
}

module.exports = new Role();