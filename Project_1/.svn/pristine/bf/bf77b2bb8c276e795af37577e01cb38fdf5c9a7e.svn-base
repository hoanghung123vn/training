'use strict';
const config = require('../../config'),
    Pool = require('../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Utils = require('../core/utils'),
    response = require('../core/response');
var jwt = require('jsonwebtoken');

class Member {
    constructor() {

    }
    getById(userId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('id', sql.Int, userId);
                request.query('Select Id,UserName,FullName,Avatar,Status,Email,Mobile,LoginType from [Member] where id = @id').then(result => {
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
    checkEmail(email) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Email', sql.NVarChar(250), email);
                request.query('Select Top(1) Email from [Member] where Email = @Email').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success(null, 0, 'EmailExists'));
                    } else {
                        return resolve(response.success());
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
    checkUserName(userName) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('UserName', sql.NVarChar(250), userName);
                request.query('Select Top(1) Email from [Member] where UserName = @UserName').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success(null, 0, 'UserNameExists'));
                    } else {
                        return resolve(response.success());
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
    signIn(userName, password) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('userName', sql.NVarChar(50), userName);
                request.query('Select Id, UserName, Email, FullName, Avatar, LoginType, Status, Password from [Member] where (userName = @userName or email = @userName)').then(result => {
                    if (result.rowsAffected == 1) {
                        var res = result.recordset[0];
                        if (res.Status == 0) {
                            return resolve(response.error('Tài khoản của bạn đang bị khóa!'));
                        } else if (Utils.decrypt(res.Password) == password) {
                            var tokenObj = {
                                Id: res.Id,
                                UserName: res.UserName,
                            }
                            var member = {
                                id: res.Id,
                                userName: res.UserName,
                                email: res.Email,
                                fullName: res.FullName,
                                avatar: res.Avatar,
                                token: jwt.sign(tokenObj, config.security.get_token_secret_key),
                            }
                            return resolve(response.success(member));
                        } else {
                            return resolve(response.error('Đăng nhập không thành công!'));
                        }
                    } else {
                        return resolve(response.error('Đăng nhập không thành công!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    signTwitter(token) {
        return new Promise((resolve, reject) => {
            passport.use(new TwitterStrategy({
                consumerKey: config.twitter.key,
                consumerSecret: config.twitter.secret,
                callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
            },
                function (token, tokenSecret, profile, cb) {
                    var request = new sql.Request();
                    request.input('OpenId', sql.NVarChar(250), profile.id);
                    request.input('LoginType', sql.VarChar(50), 'twitter');
                    request.query('select Id, UserName, Email, FullName, Avatar from [Member] where OpenId = @OpenId and LoginType = @LoginType').then(result => {
                        if (result.rowsAffected == 1) {
                            var res = result.recordset[0];
                            var tokenObj = {
                                Id: res.Id,
                                UserName: res.UserName,
                                Email: res.Email,
                                FullName: res.FullName,
                                Avatar: res.Avatar
                            }
                            tokenObj.Token = jwt.sign(tokenObj, config.security.get_token_secret_key);
                            return resolve(response.success(tokenObj));
                        } else {
                            var request2 = new sql.Request();
                            request2.input('userName', sql.NVarChar(50), profile.id);
                            request2.input('email', sql.NVarChar(250), profile.email);
                            request2.input('fullName', sql.NVarChar(250), profile.name);
                            request2.input('mobile', sql.NVarChar(50), '');
                            request2.input('password', sql.NVarChar(250), '');
                            request2.input('avatar', sql.NVarChar(500), profile.profile_background_image_url);
                            request2.input('loginType', sql.VarChar(50), 'twitter');
                            request2.input('createdDate', sql.DateTime, new Date());
                            request2.query('insert into Member(UserName,PassWord, FullName,Avatar,Status,Email,Mobile, LoginType, CreatedDate) values(@userName,@password, @fullName,@avatar , 1, @email, @mobile, @loginType, @createdDate )').then(result => {
                                if (result.rowsAffected == 1) {
                                    return resolve(response.success());
                                } else {
                                    return resolve(response.error('Đã có lỗi xảy ra!'));
                                }
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    sql.on('error', err => {
                        console.log(err);
                        return resolve(response.error(err));
                    });
                    return cb(err, user);
                    User.findOrCreate({
                        twitterId: profile.id
                    }, function (err, user) {

                    });
                }
            ));
        });
    }
    signLine(member) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('OpenId', sql.NVarChar(50), member.userId);
                request.query(`Select TOP(1) Id, UserName, Email, FullName, Avatar, LoginType, Status, OpenId from [Member] where (UserName = @OpenId AND LoginType = 'LINE')`).then(result => {
                    if (result.rowsAffected == 1) {
                        var res = result.recordset[0];
                        if (res.Status == 0) {
                            return resolve(response.error('Tài khoản của bạn đang bị khóa!'));
                        } else {
                            var tokenObj = {
                                Id: res.Id,
                                UserName: res.UserName,
                            }
                            var memberRes = {
                                id: res.Id,
                                userName: res.UserName,
                                email: res.Email || '',
                                fullName: res.FullName || '',
                                avatar: res.Avatar || '',
                                token: jwt.sign(tokenObj, config.security.get_token_secret_key),
                                isNewMember: false
                            }
                            return resolve(response.success(memberRes));
                        }
                    } else {
                        Pool.mainDb().then(function (db2) {
                            var request2 = db2.request();
                            request2.input('userName', sql.NVarChar(50), member.userId);
                            request2.input('email', sql.NVarChar(250), member.email | '');
                            request2.input('fullName', sql.NVarChar(250), member.displayName);
                            request2.input('mobile', sql.NVarChar(50), member.mobile || '');
                            request2.input('password', sql.NVarChar(250), '');
                            request2.input('avatar', sql.NVarChar(500), member.avatar || '');
                            request2.input('openId', sql.NVarChar(250), member.userId);
                            request2.input('loginType', sql.VarChar(50), 'LINE');
                            request2.output('Id', sql.Int, 0);
                            request2.query('insert into Member(UserName,PassWord, FullName,Avatar,Status,Email,Mobile, OpenId, LoginType, CreatedDate) values(@userName,@password, @fullName,@avatar , 1, @email, @mobile, @openId, @loginType, GETDATE() ); SELECT @Id = @@IDENTITY;').then(result2 => {
                                var tokenObj = {
                                    Id: result.output.Id,
                                    UserName: member.userId,
                                }
                                var memberRes = {
                                    id: result.output.Id,
                                    userName: member.userId,
                                    email: member.email || '',
                                    fullName: member.displayName || '',
                                    avatar: member.avatar || '',
                                    token: jwt.sign(tokenObj, config.security.get_token_secret_key),
                                    isNewMember: true
                                }
                                return resolve(response.success(memberRes));
                            }).catch(err => {
                                console.log(err);
                            });
                        })

                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    signUp(userName, password, fullName, mobile, email) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('userName', sql.NVarChar(50), userName);
                request.input('email', sql.NVarChar(250), email);
                request.query('select UserName, email from [Member] where userName = @userName or email = @email').then(result => {

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
                            request2.input('userName', sql.NVarChar(50), userName);
                            request2.input('email', sql.NVarChar(250), email);
                            request2.input('fullName', sql.NVarChar(250), fullName);
                            request2.input('mobile', sql.NVarChar(50), mobile);
                            request2.input('password', sql.NVarChar(250), Utils.encrypt(password));
                            request2.input('avatar', sql.NVarChar(250), '');
                            request2.input('loginType', sql.VarChar(50), 'email');
                            request2.input('createdDate', sql.DateTime, new Date());
                            request2.query('insert into Member(UserName,PassWord, FullName,Avatar,Status,Email,Mobile, LoginType, CreatedDate) values(@userName,@password, @fullName,@avatar , 1, @email, @mobile, @loginType, @createdDate )').then(result => {
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
                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }

    updateProfile(userObj) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, userObj.memberId);
                request.query('select FullName, Mobile, Avatar from [Member] where Id = @Id').then(result => {

                    if (result.rowsAffected == 1) {
                        var user = result.recordset[0];
                        Pool.mainDb().then(function (db2) {
                            var request2 = db2.request();
                            request2.input('Id', sql.Int, userObj.memberId);
                            request2.input('FullName', sql.NVarChar(250), userObj.full_name || user.FullName);
                            request2.input('Mobile', sql.NVarChar(50), userObj.mobile || user.Mobile);
                            request2.input('Avatar', sql.NVarChar(50), userObj.avatar || user.Avatar);
                            request2.query('Update Member set FullName = @FullName, Avatar = @Avatar, Mobile = @Mobile Where Id = @Id').then(result => {
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
                    } else {
                        return resolve(response.error('Tài khoàn không tồn tại!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
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
                request.query('Select Password from [Member] where Id = @Id').then(result => {
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
                                request2.query('Update Member set Password = @Password, LastChangePass = @Date, ModifiedDate = @Date Where Id = @Id').then(result => {
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
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    newPassword(email, password) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Email', sql.VarChar(250), email);
                request.query('Select * from [Member] where Email = @Email').then(result => {
                    if (result.rowsAffected == 1) {
                        var user = result.recordset[0];
                        Pool.mainDb().then(function (db2) {
                            var request2 = db2.request();
                            request2.input('Id', sql.Int, user.Id);
                            request2.input('Password', sql.NVarChar(250), Utils.encrypt(password));
                            request2.input('Date', sql.DateTime, new Date());
                            request2.query('Update Member set Password = @Password, LastChangePass = @Date Where Id = @Id').then(result => {
                                return resolve(response.success());
                            }).catch(err => {
                                console.log(err);
                                return resolve(response.error(err));
                            });
                        }).catch(err => {
                            return resolve(response.error(err));
                        });
                    } else {
                        return resolve(response.error('Tài khoàn không tồn tại!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
                sql.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    updateVerifiedCode(userName, Code) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('UserName', sql.VarChar(250), userName);
                request.input('Code', sql.Int, Code);
                request.query('Update [Member] Set VerifiedCode = @Code, VerifiedExpires = GETDATE() where UserName = @UserName').then(result => {
                    return resolve(response.success());
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
    verifiedCode(userName, Code) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('UserName', sql.VarChar(250), userName);
                request.input('Code', sql.Int, Code);
                request.query('Select * From Member where UserName = @UserName AND VerifiedCode = @Code').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success());
                    } else {
                        return resolve(response.error('VerificationCodeNotFound'));
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
}

module.exports = new Member();