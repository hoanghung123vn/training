'use strict';
const _config = require('../../../config'),
    Pool = require('../../core/mssql'),
    sql = require("mssql"),
    Promise = require('bluebird'),
    response = require('../../core/response'),
    _ = require('lodash');

class Language {
    constructor() {

    }
    getListLanguage() {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.query('Select * from [Language] ORDER BY Priority DESC').then(result => {
                    return resolve(response.success(result.recordset));
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getListLanguageStatic() {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.query('Select * from [LanguageStatic] ORDER BY LanguageKey ASC').then(result => {
                    return resolve(result.recordset);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getListLanguageStaticByLang() {
        return new Promise((resolve, reject) => {
            Pool.mainDb().then(function (db) {
                var request = db.request();
                request.query('Select * from [LanguageStaticByLang]').then(result => {
                    return resolve(result.recordset);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                return resolve(response.error(err));
            });
        });
    }
    getListLanguageStaticFull() {
        return new Promise((resolve, reject) => {
            try {
                let p1 = this.getListLanguageStatic();
                let p2 = this.getListLanguageStaticByLang();
                Promise.all([p1, p2]).then(function (values) {
                    let keys = values[0];
                    let langs = values[1];
                    let _langs = {};
                    let data = [];
                    _.each(keys, (item) => {
                        let _data = _.filter(langs, (lang) => {
                            return lang.LanguageStaticKey == item.LanguageKey;
                        });
                        _.each(_data, (_d) => {
                            _langs[_d.LanguageCode] = _d.LanguageValue;
                        });
                        data.push({
                            Info: item,
                            Langs: _langs
                        })
                    });
                    console.log(data);
                    return resolve(response.success(data));
                });
            } catch (err) {
                console.log(err);
                return resolve(response.error(err));
            }
        });
    }
    saveLanguageStatic(){

    }
}

module.exports = new Language();