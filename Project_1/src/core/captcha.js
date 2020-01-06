const Utils = require('../core/utils'),
    svgCaptcha = require('svg-captcha');

exports.create = function () {
    var captcha = svgCaptcha.create({
        size: 5,
        charPreset: '1234567890',
        background: '#2d83ba',
        height: 38,
        fontSize: 45
    });
    
    return {
        success: true,
        errorCode: 0,
        content: Utils.encrypt(captcha.text),
        data: captcha.data,
        totalRow: 0
    }
};