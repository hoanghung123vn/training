var _ = require('lodash');
var request = require('request');
var sql = require('mssql');
var schedule = require('node-schedule');
var config = require('../../config');
var email = require('../core/email');


var currentMemberList = [];
var currentLongTimeNoSeeCount = 0;
var currentStudyInfoCount = 0;
var getVipData = function(app, io) {
    currentMemberList = [];
    currentLongTimeNoSeeCount = 0;
    currentStudyInfoCount = 0;
    var request = new sql.Request();
    request.execute('SV_Member_GetVIP', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    currentMemberList = data;
                    processByMember();
                }
            });
        }
    });
};

var processByMember = function() {
    if (currentMemberList.length > 0) {
        var member = currentMemberList.pop();
        //console.log(member);
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (member.LastLogined <= oneWeekAgo) {
            currentLongTimeNoSeeCount++;
            processOneWeekNotLogin(member, function() {
                setTimeout(function() {
                    processByMember();
                }, 2000);
            });
        } else {
            currentStudyInfoCount++;
            processStudyEmail(member, function() {
                setTimeout(function() {
                    processByMember();
                }, 2000);
            });
        }
    } else {
        email.send({
            to: 'tu.phunganh@gmail.com, huandn@dekiru.vn',
            title: 'Email thông báo kết quả học đã được xử lý!',
            body: '<p>Email nhắc lâu không vào: <b>' + currentLongTimeNoSeeCount + '</b></p>' + '<p>Email thông báo kết quả học tuần vừa qua: <b>' + currentStudyInfoCount + '</b></p>'
        });
        console.log('Email nhắc lâu không vào: ' + currentLongTimeNoSeeCount + ',' + 'Email thông báo kết quả học tuần vừa qua: ' + currentStudyInfoCount);
    }
};

var processOneWeekNotLogin = function(member, cb) {
    console.log('run to send email one week not login');
    request(config.email.templates.notifyLogin + '&id=' + member.Id, function(error, response, body) {
        if (!error) {
            email.send({
                to: member.Email,
                title: 'Dekiru nhớ mong bạn rất nhiều!',
                body: body
            });
            console.log('send email to', member.Email);
        }
        cb();
    });
};

var processStudyEmail = function(member, cb) {
    console.log('run to send email study info');
    request(config.email.templates.studyInfo + '&id=' + member.Id, function(error, response, body) {
        if (!error) {
            email.send({
                to: member.Email,
                title: 'Dekiru: Kết quả học tập hàng tuần của bạn!',
                body: body
            });
            console.log('send email to', member.Email);
        }
        cb();
    });
};

module.exports.run = function(app, io) {
    setTimeout(function() {
        var j = schedule.scheduleJob('0 59 19 * * 6', function() {
            console.log('service study email notification processed!!!');
            console.log('service study email notification will process next ');
            console.log(j.nextInvocation());
            getVipData(app, io);
        });
        console.log('service study email notification will process next ');
        console.log(j.nextInvocation());
        //getVipData(app, io);
    }, 2000);
};