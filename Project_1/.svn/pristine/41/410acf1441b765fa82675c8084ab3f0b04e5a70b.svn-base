var Config = require('../../models/cms/config');
var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../../core/response');

module.exports.run = function (app, io) {
    app.post('/cms/config/save', [authenticate.checkLogin], function (req, res) {
        var configKey = req.body.configKey || '';
        var ConfigName = req.body.configName || '';
        var configValue = req.body.configValue || '';
        if (ConfigName == '' || configKey ==''|| configValue =='') {
            res.send('missing parameter!');
        } else {
            Config.update(configKey, ConfigName, configValue).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/config/list', [authenticate.checkLogin], function (req, res) {
        Config.getList().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
    app.post('/cms/config/detail', [authenticate.checkLogin], function (req, res) {
        var config_key = req.body.configKey || '';
        if (config_key == '') {
            res.send('missing parameter @config_key!');
        } else {
            Config.getByKey(config_key).then(function (msg) {
                return res.jsonp(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    });
    app.post('/cms/system/init', [authenticate.checkApiSecretKey], function (req, res) {
        Config.getInit().then(function (msg) {
            return res.jsonp(msg);
        }).catch(err => {
            console.log(err);
        });
    });
}