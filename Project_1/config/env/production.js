'use strict';

const CONFIG = {
    server: {
        host: 'localhost',
        port: process.env.PORT || 3000,
        domain: 'https://api.fukuon.com'
    },
    mainDB: {
        user: 'dekiru_admin',
        password: '12345',
        server: '112.78.1.97',
        database: 'Dekiru',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 1000
        }
    }
};

module.exports = CONFIG;