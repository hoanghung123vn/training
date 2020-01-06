'use strict';
const config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    response = require('../../core/response');

class CComment {
    constructor() {

    }
    getById(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.BigInt, id);
                request.query('select Id, PostId, MemberId, ParentId, Content, Status, CreatedDate,' +
                    'likeCount from [Comment] where Id = @Id').then(result => {
                        if (result.rowsAffected == 1) {
                            return resolve(response.success(result.recordset[0]));
                        } else {
                            return reject(response.error('Comment not found!'));
                        }
                    }).catch(err => {
                        console.log(err);
                        return reject(err);
                    });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    search(postId, status, keyword, pageIndex, pageSize) {
        return new Promise((resolve, reject) => {
            var TotalRows = 0;
            if (keyword != '')
                keyword = '%' + keyword + '%';
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('PostId', sql.BigInt, postId);
                request.input('Status', sql.Int, status);
                request.input('Keyword', sql.NVarChar(250), keyword);
                request.input('PageIndex', sql.Int, pageIndex);
                request.input('PageSize', sql.Int, pageSize);
                request.output('TotalRows', sql.Int, TotalRows)

                var where = " Where 1 = 1";
                if (postId > 0)
                    where += " And PostId = @PostId";
                if (keyword != '')
                    where += " And (@Keyword = '' OR PATINDEX(@Keyword, Content) > 0)";
                if (status >= 0)
                    where += " And c.Status = @Status";

                request.query(`SELECT * FROM  (SELECT c.Id,PostId,MemberId,ParentId,Content,c.Status,c.CreatedDate,c.LikeCount, m.Avatar, m.FullName,
                            row_number() OVER (Order By c.Id DESC) AS RowNum  
                            FROM Comment c INNER JOIN Member m on c.MemberId = m.Id `+ where + `) AS T
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By T.Id DESC; 
                            SELECT @TotalRows = COUNT(0) FROM Comment c `+ where).then(result => {
                        return resolve(response.success(result.recordset, result.output.TotalRows));
                    }).catch(err => {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    insert(comment) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('postId', sql.BigInt, comment.postId);
                request.input('MemberId', sql.Int, comment.memberId);
                request.input('ParentId', sql.BigInt, comment.parentId);
                request.input('Content', sql.NVarChar(max), comment.content);
                request.input('CreatedDate', sql.DateTime, new Date());
                request.input('Status', sql.Int, 1);
                request.query('insert into Comment(PostId, MemberId, ParentId, Content, CreatedDate,'
                    + 'Status) values(@PostId, @MemberId, @ParentId, @Content, @CreatedDate, @Status)')
                    .then(result => {
                        if (result.rowsAffected == 1) {
                            return resolve(response.success());
                        } else {
                            return resolve(response.error('Đã có lỗi xảy ra'));
                        }
                    }).catch(err => {
                        console.log(err);
                        return reject(err);
                    });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }

    update(comment) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db2) {
                var request2 = db2.request();
                request2.input('Id', sql.BigInt, comment.id);
                request2.input('Content', sql.NVarChar(max), comment.content);
                request2.query('Update Comment set Content = @Content Where Id = @Id').then(result => {
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
                request.input('Id', sql.BigInt, id);
                request.input('Status', sql.Int, status);
                request.query('Update Comment set Status = @Status Where Id = @Id').then(result => {
                    if (result.rowsAffected > 0) {
                        return resolve(response.success());
                    } else {
                        return reject(new Error('Post not found!'));
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
    delete(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db2) {
                var request2 = db2.request();
                request2.input('Id', sql.BigInt, id);
                request2.input('Status', sql.NVarChar(max), 0 || 1);
                request2.query('Update Comment set Status = @Status Where Id = @Id').then(result => {
                    if (result.rowsAffected > 0) {
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

module.exports = new CComment();
