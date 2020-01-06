var config = require('../../config');
var _ = require('lodash');
var configSql = config.services.exam_notification.db;
var Notify = require('../models/notify');
var UserOnline = require('../models/useronline');
var sql = require('mssql');

var getCurrentExam = function(app, io) {
    var request = new sql.Request();
    request.execute('SV_ExamOnlineRegistered_GetCurrent', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    var _count = 0;
                    _.each(data, function(item) {
                        delete item.IsNotified;
                        UserOnline.paginate({
                            user_id: item.MemberId
                        }, {
                            select: '_id user_id connection_id registration_id',
                            sort: {
                                created_date: 'desc'
                            },
                            page: 1,
                            limit: 100
                        }).then(function(uOnlines) {
                            if (uOnlines.total > 0) {
                                _.each(uOnlines.docs, function(user) {
                                    console.log('emit to ', user.connection_id);
                                    var opts = {
                                        title: 'Đã đến giờ làm bài thi [' + item.Title + ']',
                                        content: 'Đã đến giờ làm bài thi <b>' + item.Title + '</b>',
                                        payload: item,
                                        is_web: true,
                                        is_email: false,
                                        is_app: true,
                                        receive_user: item.MemberId,
                                        type: config.Enum.NotificationType.ExamOnline
                                    };
                                    io.of('notification').to(user.connection_id).emit('notify', opts);
                                    var request2 = new sql.Request();
                                    request2.input('ExamId', sql.Int, item.ExamId);
                                    request2.input('MemberId', sql.BigInt, item.MemberId);
                                    request2.execute('SV_ExamOnlineRegistered_MarkNotified', function(err, result) {
                                        _count++;
                                        if (err) {
                                            console.error('notification services error #1', err);
                                        } else {
                                            if (_count == data.length) {
                                                console.log('well done! notification sent to [' + data.length + '] members!');
                                            }
                                        }
                                    });
                                });
                            }
                        }).catch(err => {
                            console.error('notification services error #5', err);
                        });
                    });
                } else {

                }
            });
        }
    });
};

//Notify offline + online khi có đề thi Offline mới, phù hợp với trình độ
var getCurrentExamOffline = function(app, io) {
    var request = new sql.Request();
    request.execute('SV_ExamOffline_GetCurrent', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var isProcessed = [];
            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    _.each(data, function(item) {
                        if (!isProcessed.includes(item.ExamId)) {
                            isProcessed.push(item.ExamId);
                            var request2 = new sql.Request();
                            request2.input('ExamId', sql.Int, item.ExamId);
                            request2.execute('SV_ExamOffline_MarkNotified', function(err, result) {
                                if (err) {
                                    console.error('notification services error #4', err);
                                } else {
                                    console.log('mark notified exam!', item.ExamId);
                                }
                            });
                        }
                    });
                }
            });

            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    var _count = 0;
                    _.each(data, function(item) {
                        delete item.IsNotified;
                        //Notify Offline
                        var _title = 'Hệ thống vừa cập nhật 1 đề thi phù hợp với trình độ của bạn (N' + item.Level + ')! Tham gia thi ngay!';
                        var opts = {
                            title: _title,
                            content: _title,
                            payload: item,
                            is_web: true,
                            is_email: false,
                            is_app: true,
                            receive_user: item.MemberId,
                            type: config.Enum.NotificationType.ExamOffline
                        };
                        var msg = new Notify(opts);
                        msg.save().then(function(data2) {
                            opts._id = data2._id.toString();
                            //NotifyOnline
                            UserOnline.paginate({
                                user_id: item.MemberId
                            }, {
                                select: '_id user_id connection_id registration_id',
                                sort: {
                                    created_date: 'desc'
                                },
                                page: 1,
                                limit: 100
                            }).then(function(uOnlines) {
                                if (uOnlines.total > 0) {
                                    _.each(uOnlines.docs, function(user) {
                                        console.log('emit to ', user.connection_id);
                                        io.of('notification').to(user.connection_id).emit('notify', opts);
                                    });
                                }
                            }).catch(err => {
                                console.error('notification services error #5', err);
                            });
                            console.log('offline notified send to ', item.MemberId);
                        }).catch(err => {
                            console.error('notification services error #5', err);
                        });
                    });
                } else {

                }
            });
        }
    });
};

module.exports.run = function(app, io) {
    console.log('service exam online notification is running each ' + config.services.exam_notification.interval + 'ms.');
    setInterval(function() {
        getCurrentExam(app, io);
    }, config.services.exam_notification.interval);

    console.log('service exam offline notification is running each ' + config.services.exam_notification.intervalMedium + 'ms.');
    setInterval(function() {
        getCurrentExamOffline(app, io);
    }, config.services.exam_notification.intervalMedium);
};