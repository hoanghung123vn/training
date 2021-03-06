'use strict';
const config = require('../../config'),
    Pool = require('../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.EncryptKey),
    response = require('../core/response');
var jwt = require('jsonwebtoken');

class MemberFollow {
    constructor() {

    }
    getListByAuthorId(AuthorId, pageIndex, pageSize) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('AuthorId', sql.BigInt, AuthorId);
                request.input('PageIndex', sql.Int, pageIndex);
                request.input('PageSize', sql.Int, pageSize);
                request.output('TotalRows', sql.Int, 0)
                request.query(`SELECT * FROM  (SELECT M.Id,UserName, FullName,L.CreatedDate,
                            row_number() OVER (Order By L.CreatedDate DESC) AS RowNum  
                            FROM Post M
                            JOIN MemberFollow L ON M.Id = L.AuthorId
                            WHERE M.Id = @AuthorId) AS M
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By L.CreatedDate DESC; 
                            SELECT @TotalRows = COUNT(0) FROM MemberFollow AS M WHERE M.AuthorId = @AuthorId`).then(result => {
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
    follow(AuthorId, memberId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('AuthorId', sql.BigInt, AuthorId);
                request.input('MemberId', sql.Int, memberId);
                request.input('CreatedDate', sql.DateTime, new Date());
                request.query('Insert into MemberFollow(AuthorId, MemberId,CreatedDate) values(@AuthorId, @MemberId, @CreatedDate); Update Post Set LikeCount = ISNULL(LikeCount, 0) + 1 Where Id = @AuthorId').then(result => {
                    return resolve(response.success());
                }).catch(err => {
                    return resolve(response.error('Đã có lỗi xảy ra!'));
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

    unFollow(AuthorId, memberId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('AuthorId', sql.BigInt, AuthorId);
                request.input('MemberId', sql.Int, memberId);
                request.query('Delete MemberFollow Where AuthorId = @AuthorId And @MemberId = @MemberId; Update Post Set LikeCount = LikeCount - 1 Where Id = @AuthorId').then(result => {
                    return resolve(response.success());
                }).catch(err => {
                    return resolve(response.error('Đã có lỗi xảy ra!'));
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
}

module.exports = new MemberFollow();