var config = require('../config/database');
var sql = require('mssql');
var getRequest = () => {
    const conn = sql.connect(config);
    var request = new sql.Request();
    return request;
};

module.exports = getRequest;