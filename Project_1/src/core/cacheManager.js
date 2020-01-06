var cache = require('memory-cache');
var timeOut = 24 * 60 * 1000;
module.exports = {
    add : function (cacheKey, data, time) {
        if(!time)
            time = timeOut;
        return cache.put(cacheKey, data, time);
    },
    get: function (cacheKey) {
        return cache.get(cacheKey);
    },
    remove: function (cacheKey) {
        return cache.del(cacheKey);
    },
    removeAll: function () {
        return cache.clear();
    }
}