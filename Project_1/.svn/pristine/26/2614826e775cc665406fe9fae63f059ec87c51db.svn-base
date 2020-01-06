var Language = require('../../models/cms/language');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../../core/response');

module.exports.run = function (app, io) {
    app.post('/cms/language/list', [authenticate.checkLogin], function (req, res) {
        Language.getListLanguage().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/language/list_static', [authenticate.checkLogin], function (req, res) {
        Language.getListLanguageStaticFull().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/language/save_static', [authenticate.checkApiSecretKey], function (req, res) {
        Language.saveLanguageStatic().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
}