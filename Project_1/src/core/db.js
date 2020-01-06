var mongodb = require('mongodb');
var config = require('../../config');
var events = require('events');
var event = new events.EventEmitter();
var client = null;

var MongoClient = mongodb.MongoClient;
var url = config.mongoDB.url;
if (!client) {
    MongoClient.connect(url).then(function(db) {
        console.info('mongodb connected!');
        client = db;
        event.emit('connect');
    }).catch(err => {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        event.emit('error');
        client = null;
    });
}

exports.get = function(fn) {
    if (client) {
        fn(client);
    } else {
        event.on('connect', function() {
            fn(client);
        });
    }
};