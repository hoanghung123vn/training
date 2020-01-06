var config = require('../../config');
var _ = require('lodash');
var configSql = config.services.exam_notification.db;
var Notify = require('../models/notify');
var UserOnline = require('../models/useronline');
var sql = require('mssql');
var schedule = require('node-schedule');

var getTranslateData = function(app, io) {
    var request = new sql.Request();
    request.execute('SV_Translate_GetTodayApproved', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    var _count = 0;
                    _.each(data, function(item) {
                        var opts = {
                            title: 'Cộng đồng dịch',
                            content: 'Chúng tôi đã duyệt ' + item.Count + ' câu dịch của bạn. Điều bạn đang làm thật tuyệt vời!',
                            payload: item,
                            is_web: true,
                            is_email: false,
                            is_app: true,
                            receive_user: item.MemberId,
                            type: config.Enum.NotificationType.TranslateApproved
                        };
                        var msg = new Notify(opts);
                        msg.save().then(function(data) {
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
                            });
                        });
                    });
                }
            });
        }
    });
};

module.exports.run = function(app, io) {
    setTimeout(function() {
        var j = schedule.scheduleJob('0 59 23 * * *', function() {
            console.log('service translate notification processed!!!');
            getTranslateData(app, io);
        });
        console.log('service translate notification is running, it will process at: 23:59:00 PM');
    }, 2000);
};