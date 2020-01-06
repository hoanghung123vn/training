

var userPer = require('../models/cms/user');
var cache = require('memory-cache');

exports.getUserPermission = function(userId) {
    var cacheKey = 'UserPermission_'+ userId;
    var data = cache.get(cacheKey);
    console.log('cache', data);
    if(!data){
        console.log('cache1');
        userPer.getPermission(userId).then(function (msg) {
            data = msg.data;
            cache.put(cacheKey, data, 24 * 60 * 1000);
            console.log('cache2', data);
            return data;
        })
    }else
        return data;
}