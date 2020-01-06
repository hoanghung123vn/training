'use strict';
const config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Utils = require('../../core/utils'),
    response = require('../../core/response');
var jwt = require('jsonwebtoken');
var cache = require('../../core/cacheManager');

class User {
    constructor() {

    }
    getById(userId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('id', sql.Int, userId);
                request.query('Select Id,UserName,FullName,Avatar,Status,Email,Mobile,RoleId from [User] where id = @id').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success(result.recordset[0]));
                    } else {
                        return reject(new Error('user not found or not active!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return reject(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    search(keyword, status, pageIndex, pageSize) {
        return new Promise((resolve, reject) => {
            var TotalRows = 0;
            if (keyword != '')
                keyword = '%' + keyword + '%';
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Status', sql.Int, status);
                request.input('Keyword', sql.NVarChar(250), keyword);
                request.input('PageIndex', sql.Int, pageIndex);
                request.input('PageSize', sql.Int, pageSize);
                request.output('TotalRows', sql.Int, TotalRows)
                request.query(`SELECT * FROM  (SELECT Id,UserName,Password,FullName,Email,Mobile,Avatar,CreatedDate,Status,LastLogined,LastChangePass,ModifiedDate, RoleId,
                            row_number() OVER (Order By CreatedDate DESC) AS RowNum  
                            FROM [User] WHERE (@Status < 0 OR Status = @Status) AND (@Keyword = '' OR PATINDEX(@Keyword, UserName) > 0 OR PATINDEX(@Keyword, FullName) > 0)) AS M
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By M.CreatedDate DESC; 
                            SELECT @TotalRows = COUNT(0) FROM [User] WHERE (@Status < 0 OR Status = @Status) AND (@Keyword = '' OR PATINDEX(@Keyword, UserName) > 0 OR PATINDEX(@Keyword, FullName) > 0)`).then(result => {
                        return resolve(response.success(result.recordset, result.output.TotalRows));
                    }).catch(err => {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    });
                sql.on('error', err => {
                    console.log(err);
                    return reject(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    login(userName, password) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('userName', sql.NVarChar(50), userName);
                request.query('Select Id, UserName, Email, FullName, Avatar, Status, Password from [User] where (userName = @userName or email = @userName)').then(result => {
                    if (result.rowsAffected == 1) {
                        var res = result.recordset[0];
                        if (res.Status == 0) {
                            return resolve(response.error('Tài khoản của bạn đang bị khóa!'));
                        } else if (Utils.decrypt(res.Password) == password) {
                            var tokenObj = {
                                Id: res.Id,
                                UserName: res.UserName
                            }

                            Pool.mainDb().then(function (db2) {
                                var request2 = db2.request();
                                request2.input('UserId', sql.Int, res.Id);
                                var queryStr = 'Select * From UserPermission Where @UserId = @UserId; Select * From Permission';
                                request2.query(queryStr).then(resData => {
                                    var perData = Utils.camelCase(resData.recordsets);
                                    return resolve(response.success({
                                        user: {
                                            id: res.Id,
                                            userName: res.UserName,
                                            email: res.Email,
                                            fullName: res.FullName,
                                            avatar: res.Avatar,
                                            token: jwt.sign(tokenObj, config.security.get_token_secret_key),
                                        },
                                        allPermission: perData[1],
                                        userPermission: perData[0]
                                    }));
                                }).catch(err => {
                                    console.log(err);
                                    return resolve(null);
                                });
                            }).catch(err => {
                                return resolve(response.error(err));
                            });

                        } else {
                            return resolve(response.error('Đăng nhập không thành công!'));
                        }
                    } else {
                        return resolve(response.error('Đăng nhập không thành công!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
            sql.on('error', err => {
                console.log(err);
                return resolve(response.error(err));
            });
        });
    }

    add(userName, password, fullName, mobile, email, roleId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('userName', sql.NVarChar(50), userName);
                request.input('email', sql.NVarChar(250), email);
                request.query('Select UserName, email from [User] where userName = @userName or email = @email').then(result => {

                    if (result.rowsAffected == 1) {
                        var res = result.recordset[0];
                        if (res.UserName == userName) {
                            return resolve(response.error('Tên đăng nhập đã tồn tại!'));
                        } else {
                            return resolve(response.error('Email đã đã đăng ký cho 1 tài khoản khác!'));
                        }
                    } else {
                        Pool.mainDb().then(function (db2) {
                            var request2 = db2.request();
                            request2.input('UserName', sql.NVarChar(50), userName);
                            request2.input('Email', sql.NVarChar(250), email);
                            request2.input('FullName', sql.NVarChar(250), fullName);
                            request2.input('Mobile', sql.NVarChar(50), mobile);
                            request2.input('Password', sql.NVarChar(250), Utils.encrypt(password));
                            request2.input('Avatar', sql.NVarChar(250), '');
                            request2.input('RoleId', sql.Int, roleId);
                            request2.input('CreatedDate', sql.DateTime, new Date());
                            request2.query(`DECLARE @Id INT; 
                                    Insert into [User](UserName,PassWord, FullName,Avatar,Status,Email,Mobile, CreatedDate, RoleId) values(@UserName,@Password, @FullName,@Avatar, 1, @Email, @Mobile,  @CreatedDate, @RoleId);
                                    SELECT @Id = @@IDENTITY; 
                                    Insert Into UserPermission(UserId, PermissionId) Select @Id, PermissionId From RolePermission Where RoleId = @RoleId;`).then(result => {
                                    if (result.rowsAffected > 0) {
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
                    }
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        })
    }

    updateProfile(userObj) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.NVarChar(50), userObj.id);
                request.query('select FullName, Mobile, Avatar, RoleId from [User] where Id = @Id').then(result => {

                    if (result.rowsAffected > 0) {
                        var user = result.recordset[0];
                        Pool.mainDb().then(function (db2) {
                            var request2 = db2.request();
                            request2.input('FullName', sql.NVarChar(250), userObj.fullName || user.FullName);
                            request2.input('Mobile', sql.NVarChar(50), userObj.mobile || user.Mobile);
                            request2.input('Avatar', sql.NVarChar(50), userObj.avatar || user.Avatar);
                            request2.input('RoleId', sql.NVarChar(50), userObj.roleId || user.RoleId);
                            request2.input('OldRoleId', sql.NVarChar(50), user.RoleId);
                            request2.input('Id', sql.NVarChar(50), userObj.id);
                            var queryString = 'Update [User] set FullName = @FullName, Avatar = @Avatar, Mobile = @Mobile, RoleId = @RoleId Where Id = @Id; ';
                            if (userObj.roleId != user.RoleId) {
                                queryString += ` Delete UserPermission Where Exists (Select UserId, PermissionId From UserPermission p 
                                        Inner Join [User] u on p.UserId = u.Id Where u.RoleId = @OldRoleId And u.Id = @Id);
                                        Insert Into UserPermission(UserId, PermissionId) Select @Id, PermissionId From RolePermission Where RoleId = @RoleId;`;
                            }
                            request2.query(queryString).then(result => {
                                if (result.rowsAffected > 0) {
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
                    } else {
                        return reject(new Error('user not found!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    changePassword(id, password, newPassword) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.query('Select Password from [User] where Id = @Id').then(result => {
                    if (result.rowsAffected == 1) {
                        var user = result.recordset[0];
                        if (Utils.decrypt(user.Password) != password) {
                            return resolve(response.error('Mật khẩu hiện tại không chính xác!'));
                        } else {
                            Pool.mainDb().then(function (db2) {
                                var request2 = db2.request();
                                request2.input('Id', sql.Int, id);
                                request2.input('Password', sql.NVarChar(250), Utils.encrypt(newPassword));
                                request2.input('Date', sql.DateTime, new Date());
                                request2.query('Update [User] set Password = @Password, LastChangePass = @Date, ModifiedDate = @Date Where Id = @Id').then(result => {
                                    if (result.rowsAffected == 1) {
                                        return resolve(response.success());
                                    } else {
                                        return resolve(response.error('Đã có lỗi xảy ra!'));
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    return resolve(response.error(err));
                                });
                            }).catch(err => {
                                return resolve(response.error(err));
                            });
                        }
                    } else {
                        return resolve(response.error('Tài khoàn không tồn tại!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    resetPassword(id, password) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.input('Password', sql.NVarChar(250), Utils.encrypt(password));
                request.input('Date', sql.DateTime, new Date());
                request.query('Update [User] set Password = @Password, LastChangePass = @Date, ModifiedDate = @Date Where Id = @Id').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success());
                    } else {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    }
                }).catch(err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    addPermission(id, roleId, permissionIds) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('UserId', sql.Int, id);
                request.input('RoleId', sql.Int, roleId);
                var queryStr = 'Delete UserPermission Where UserId = @UserId;';
                if (roleId > 0)
                    queryStr += 'Update [User] Set RoleId = @RoleId Where Id = @UserId;';
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
                        param += `(@UserId, @PerId` + forCount + `)`
                        forCount++;
                    });
                    queryStr += 'Insert Into [UserPermission] (UserId, PermissionId) Values ' + param;
                }

                request.query(queryStr).then(result => {
                    var cacheKey = 'UserPermission_' + id;
                    cache.remove(cacheKey);
                    return resolve(response.success());
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getPermission(id) {
        return new Promise((resolve, reject) => {
            var cacheKey = 'UserPermission_' + id;
            var data = cache.get(cacheKey);
            if (!data) {
                Pool.mainDb().then(function (db) {
                    var request = db.request();
                    request.input('UserId', sql.Int, id);
                    var queryStr = 'Select * From UserPermission Where @UserId = @UserId;';
                    request.query(queryStr).then(result => {
                        data = result.recordset;
                        if (data)
                            cache.add(cacheKey, data);
                        return resolve(data);
                    }).catch(err => {
                        console.log(err);
                        return resolve(null);
                    });
                }).catch(err => {
                    return resolve(response.error(err));
                });
            } else
                return resolve(data);

        });
    }
    getPermissionByAdd(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('UserId', sql.Int, id);
                var queryStr = `Select * From PermissionGroup;
                            Select p.id, p.name, p.groupId, ISNULL(u.PermissionId, 0) isExists From Permission AS p
                            Left join UserPermission u on u.PermissionId = p.Id and UserId = @UserId`;
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

module.exports = new User();