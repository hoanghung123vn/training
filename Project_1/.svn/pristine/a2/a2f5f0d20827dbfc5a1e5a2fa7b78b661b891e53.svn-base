var config = require('../../config');
var mssql = require("mssql");
var configMainSql = config.mainDB;
var configExtSql = config.extDB;
const pool1 = new mssql.ConnectionPool(configMainSql).connect();
const pool2 = new mssql.ConnectionPool(configExtSql).connect();

module.exports = {
    mainDb() {
        return new Promise((resolve, reject) => {
            pool1.then((pool) => {
                return resolve(pool);
            })
        });
    },
    extDb() {
        return new Promise((resolve, reject) => {
            pool2.then((pool) => {
                return resolve(pool);
            })
        });
    }
}
