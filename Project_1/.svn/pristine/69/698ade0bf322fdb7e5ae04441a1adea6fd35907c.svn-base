'use strict';

const config = require('../config'),
    session = require('express-session');

let sessionStore, instance;

switch (config.sessionOpts.store) {
    case 'redis':
        let RedisStore = require('connect-redis')(session),
            opts = {
                host: config.sessionOpts.host || '127.0.0.1',
                port: config.sessionOpts.port || 6379,
                db: config.sessionOpts.db || 0,
                retry_strategy: function (options) {
                    // reconnect after
                    logger.info('[REDIS] Session store will reconnect after: 3s');
                    return 3000;
                },
                prefix: config.sessionOpts.prefix || 'session'
            };

        if (config.sessionOpts.pass) {
            opts.pass = config.sessionOpts.pass;
        }

        sessionStore = new RedisStore(opts);
        break;
    case 'memcached':
        let MemcachedStore = require('connect-memcached')(session);
        let hosts = [];
        hosts.push((config.sessionOpts.host || '127.0.0.1') + ':' + (config.sessionOpts.port || 6379));
        sessionStore = new MemcachedStore({
            hosts: hosts,
            prefix: config.sessionOpts.prefix || 'session'
        });
        break;
    case 'file':
        let FileStore = require('session-file-store')(session);
        sessionStore = new FileStore({
            retries: config.sessionOpts.retries || 3,
            logFn: config.sessionOpts.log ? logger.info : function () {
            }
        });
        break;
    case 'mongodb':
        let MongoStore = require('connect-mongo')(session);
        sessionStore = new MongoStore({
            url: config.sessionOpts.connectionString
        });
        break;
}

instance = session({
    store: sessionStore,
    secret: config.sessionOpts.secret,
    resave: config.sessionOpts.resave,
    saveUninitialized: true,
    cookie: {
        maxAge: config.sessionOpts.maxAge || 3600000
    },
    name: config.sessionOpts.name
});

module.exports = instance;