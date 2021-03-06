'use strict';
const config = require('../../config'),
    Pool = require('../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Utils = require('../core/utils'),
    response = require('../core/response');

class PostLike {
    constructor() {

    }
    getListByPostId(PostId, pageIndex, pageSize) {
        return new Promise((resolve, reject) => {
            var TotalRows = 0;
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('PostId', sql.BigInt, PostId);
                request.input('PageIndex', sql.Int, pageIndex);
                request.input('PageSize', sql.Int, pageSize);
                request.output('TotalRows', sql.Int, TotalRows)
                request.query(`SELECT * FROM  (SELECT M.Id,UserName, FullName,L.CreatedDate,
                            row_number() OVER (Order By L.CreatedDate DESC) AS RowNum  
                            FROM Post M
                            JOIN PostLike L ON M.Id = L.PostId
                            WHERE M.Id = @PostId) AS M
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By L.CreatedDate DESC; 
                            SELECT @TotalRows = COUNT(0) FROM PostLike AS M WHERE M.PostId = @PostId`).then(result => {
                        return resolve(response.success(result.recordset, result.output.TotalRows));
                    }).catch(err => {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    });
                Pool.on('error', err => {
                    console.log(err);
                    return reject(err);
                });
            });
        });
    }
    like(PostId, memberId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('PostId', sql.BigInt, PostId);
                request.input('MemberId', sql.Int, memberId);
                request.input('CreatedDate', sql.DateTime, new Date());
                request.query('Insert into PostLike(PostId, MemberId,CreatedDate) values(@PostId, @MemberId, @CreatedDate);').then(result => {
                    return resolve(response.success());
                }).catch(err => {
                    return resolve(response.error('Đã có lỗi xảy ra!'));
                });
                db.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            });
        });
    }

    unLike(PostId, memberId) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('PostId', sql.BigInt, PostId);
                request.input('MemberId', sql.Int, memberId);
                request.query('Delete PostLike Where PostId = @PostId And @MemberId = @MemberId').then(result => {
                    return resolve(response.success());
                }).catch(err => {
                    return resolve(response.error('Đã có lỗi xảy ra!'));
                });
                db.on('error', err => {
                    console.log(err);
                    return resolve(response.error(err));
                });
            });
        });
    }
}

module.exports = new PostLike();