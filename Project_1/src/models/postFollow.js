'use strict';
const config = require('../../config'),
    sql = require('mssql'),
    Promise = require('bluebird'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.EncryptKey),
    response = require('../core/response');
var jwt = require('jsonwebtoken');

class PostFollow {
    constructor() {

    }
    getListByPostId(PostId, pageIndex, pageSize) {
        return new Promise((resolve, reject) => {
            var TotalRows = 0;
            var request = new sql.Request();
            request.input('PostId', sql.BigInt, PostId);
            request.input('PageIndex', sql.Int, pageIndex);
            request.input('PageSize', sql.Int, pageSize);
            request.output('TotalRows', sql.Int, TotalRows)
            request.query(`SELECT * FROM  (SELECT M.Id,UserName, FullName,L.CreatedDate,
                            row_number() OVER (Order By L.CreatedDate DESC) AS RowNum  
                            FROM Post M
                            JOIN PostFollow L ON M.Id = L.PostId
                            WHERE M.Id = @PostId) AS M
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By L.CreatedDate DESC; 
                            SELECT @TotalRows = COUNT(0) FROM PostFollow AS M WHERE M.PostId = @PostId`).then(result => {
                return resolve(response.success(result.recordset, result.output.TotalRows));
            }).catch(err => {
                return resolve(response.error('Đã có lỗi xảy ra!'));
            });
            sql.on('error', err => {
                console.log(err);
                return reject(err);
            });
        });
    }
    follow(PostId, memberId) {
        return new Promise((resolve, reject) => {
            var request = new sql.Request();
            request.input('PostId', sql.BigInt, PostId);
            request.input('MemberId', sql.Int, memberId);
            request.input('CreatedDate', sql.DateTime, new Date());
            request.query('Insert into PostFollow(PostId, MemberId,CreatedDate) values(@PostId, @MemberId, @CreatedDate); Update Post Set LikeCount = ISNULL(LikeCount, 0) + 1 Where Id = @PostId').then(result => {
                return resolve(response.success());
            }).catch(err => {
                return resolve(response.error('Đã có lỗi xảy ra!'));
            });
            sql.on('error', err => {
                console.log(err);
                return resolve(response.error(err));
            });
        });
    }

    unFollow(PostId, memberId) {
        return new Promise((resolve, reject) => {
            var request = new sql.Request();
            request.input('PostId', sql.BigInt, PostId);
            request.input('MemberId', sql.Int, memberId);
            request.query('Delete PostFollow Where PostId = @PostId And @MemberId = @MemberId; Update Post Set LikeCount = LikeCount - 1 Where Id = @PostId').then(result => {
                return resolve(response.success());
            }).catch(err => {
                return resolve(response.error('Đã có lỗi xảy ra!'));
            });
            sql.on('error', err => {
                console.log(err);
                return resolve(response.error(err));
            });
        });
    }
}

module.exports = new PostFollow();