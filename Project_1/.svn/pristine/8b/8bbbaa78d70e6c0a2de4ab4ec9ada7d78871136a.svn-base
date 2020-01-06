'use strict';
const config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.EncryptKey),
    response = require('../../core/response');
var jwt = require('jsonwebtoken');

class CMember {
    constructor() {

    }
    getById(userId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('id', sql.Int, userId);
                request.query('Select * from [Member] where id = @id').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(result.recordset[0]);
                    } else {
                        return reject(new Error('user not found or not active!'));
                    }
                }).catch(err => {
                    console.log(err);
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
                request.query(`SELECT * FROM  (SELECT Id,UserName,Password,FullName,Email,Mobile,Avatar,CreatedDate,Status,OpenId,LoginType,LastLogined,LastChangePass,ModifiedDate,
                            row_number() OVER (Order By CreatedDate DESC) AS RowNum  
                            FROM Member WHERE (@Status < 0 OR Status = @Status) AND (@Keyword = '' OR PATINDEX(@Keyword, UserName) > 0 OR PATINDEX(@Keyword, FullName) > 0)) AS M
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By M.CreatedDate DESC; 
                            SELECT @TotalRows = COUNT(0) FROM Member WHERE (@Status < 0 OR Status = @Status) AND (@Keyword = '' OR PATINDEX(@Keyword, UserName) > 0 OR PATINDEX(@Keyword, FullName) > 0)`).then(result => {
                        return resolve(response.success(result.recordset, result.output.TotalRows));
                    }).catch(err => {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
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
                request.input('Password', sql.NVarChar(250), cryptr.encrypt(password));
                request.input('Date', sql.DateTime, new Date());
                request.query('Update Member set Password = @Password, LastChangePass = @Date, ModifiedDate = @Date Where Id = @Id').then(result => {
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
    changeStatus(id, status) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.Int, id);
                request.input('Status', sql.Int, status);
                request.input('Date', sql.DateTime, new Date());
                request.query('Update Member set Status = @Status, LastChangePass = @Date, ModifiedDate = @Date Where Id = @Id').then(result => {
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
}

module.exports = new CMember();