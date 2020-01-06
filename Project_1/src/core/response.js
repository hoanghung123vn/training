
const keysToCamelcase = require('keys-to-camelcase');
const { camelizeKeys } = require('./utils');

exports.success = function (data, totalRow, message) {
    try {
        if (data && typeof (data) == 'object')
            data = camelizeKeys(data);
        return { success: true, errorCode: 0, message: message || '', data: data, totalRow: totalRow || 0 }
    } catch (e) {
        console.log('errrr', e);
    }
};
exports.error = function (message) {
    return { success: false, errorCode: 0, message: message, data: null, totalRow: 0 }
};