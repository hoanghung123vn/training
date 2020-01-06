var _ = require('lodash');
var schedule = require('node-schedule');
var config = require('../../config');
var MediaApi = require('../core/mediaApi');

var currentMemberList = [];
var currentLongTimeNoSeeCount = 0;
var currentStudyInfoCount = 0;
var getLiveView = function(app, io) {
    MediaApi.getAllLive().then(function (msg) {
        console.log()
        if (msg) {
           
        }
    }).catch(err => {
        return res.jsonp(err);
    });
};
module.exports.run = function(app, io) {
    setTimeout(function() {
        var j = schedule.scheduleJob('1 * * * * *', function() {
            console.log('service study email notification processed!!!');
            console.log('service study email notification will process next ');
            console.log(j.nextInvocation());
            getLiveView(app, io);
        });
        console.log('service study email notification will process next ');
        console.log(j.nextInvocation());
    }, 2000);
};