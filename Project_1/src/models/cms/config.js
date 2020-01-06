'use strict';
const _config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(_config.EncryptKey),
    response = require('../../core/response');
var jwt = require('jsonwebtoken');

class Config {
    constructor() {

    }
    getByKey(ConfigKey) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('ConfigKey', sql.NVarChar(50), ConfigKey);
                request.query('Select * from [Config] where ConfigKey = @ConfigKey').then(result => {
                    if (result.rowsAffected == 1) {
                        return resolve(response.success(result.recordset[0]));
                    } else {
                        return reject(new Error('Config not found or not active!'));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getInit() {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.query('Select ConfigKey, ConfigValue from [Config]').then(result => {
                    return resolve(response.success(result.recordset));
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
                request.query('Select * from [Config]').then(result => {
                    return resolve(response.success(result.recordset));
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    update(ConfigKey, ConfigName, ConfigValue) {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.input('ConfigKey', sql.NVarChar(50), ConfigKey);
                request.input('ConfigName', sql.NVarChar(250), ConfigName);
                request.input('ConfigValue', sql.NText, ConfigValue);
                request.query('Update [Config] Set ConfigName = @ConfigName, ConfigValue = @ConfigValue Where ConfigKey = @ConfigKey').then(result => {
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
}

module.exports = new Config();