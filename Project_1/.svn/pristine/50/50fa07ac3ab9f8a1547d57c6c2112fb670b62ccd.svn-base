'use strict';
const config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    response = require('../../core/response');

class CTag {
    constructor() {

    }
    getById(id) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('Id', sql.BigInt, id);
                request.query('select * from [Tag] where Id = @Id').then(result => {
                        if (result.rowsAffected == 1) {
                            return resolve(response.success(result.recordset[0]));
                        } else {
                            return reject(response.error('Tag not found!'));
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

                var query = `SELECT c.Id,Name,PostCount,CreatedDate,c.Status,
                            row_number() OVER (Order By c.Id DESC) AS RowNum  
                            FROM Tag c `;
                var where = " Where 1 = 1";
                if (keyword != '')
                    where += " And (@Keyword = '' OR PATINDEX(@Keyword, Name) > 0)";
                if (status >= 0)
                    where += " And c.Status = @Status";
                if (postId > 0) {
                    query += "  INNER JOIN PostInTag m on c.Id = m.TagId";
                    where += " And m.PostId = @PostId";
                }
                query += where;

                request.query(`SELECT * FROM  ( ` + query + `) AS T
                            WHERE RowNum BETWEEN ((@PageIndex - 1) * @PageSize + 1) AND (@PageIndex * @PageSize)
                            Order By T.Id DESC; 
                            SELECT @TotalRows = COUNT(0) FROM Tag c `+ where).then(result => {
                                console.log(result)
                        return resolve(response.success(result.recordset, result.output.TotalRows));
                    }).catch(err => {
                        return resolve(response.error('Đã có lỗi xảy ra!'));
                    });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    insert(name, createdBy) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('CreatedBy', sql.Int, createdBy);
                request.input('Name', sql.NVarChar(250), name);
                request.input('Status', sql.Int, 1);
                request.query(`insert into Tag(Name, CreatedBy, CreatedDate,
                    Status, IsMemberCreated) values(@Name, @CreatedBy, GETDATE(), @Status, 0)`)
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

    update(id, name) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db2) {
                var request2 = db2.request();
                request2.input('Id', sql.BigInt, id);
                request2.input('Name', sql.NVarChar(250), name);
                request2.query('Update Tag set Name = @Name Where Id = @Id').then(result => {
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
                request.query('Update Tag set Status = @Status Where Id = @Id').then(result => {
                    if (result.rowsAffected > 0) {
                        return resolve(response.success());
                    } else {
                        return reject(new Error('Tag not found!'));
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
                request2.query('Delete Tag Where Id = @Id').then(result => {
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

module.exports = new CTag();
