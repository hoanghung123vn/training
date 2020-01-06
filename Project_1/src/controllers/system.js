var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../core/response');
const config = require('../../config')
const Language = require('../models/cms/language')

module.exports.run = function(app, io) {
    app.post('/init', [authenticate.checkApiSecretKey], function (req, res) {
        var configObj = {
            mediaApiUrl: config.mediaApi.playUrl,
            storageDomain: config.storage.domain
        }
        Language.getListLanguageStaticFull().then(function (msg) {
            configObj.language = msg.data;
            return res.jsonp(response.success(configObj));
        }).catch(err => {
            console.log(err);
            return res.jsonp(response.success(configObj));
        });
    });
}