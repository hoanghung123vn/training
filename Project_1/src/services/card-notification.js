var config = require('../../config');
var _ = require('lodash');
var configSql = config.services.exam_notification.db;
var Notify = require('../models/notify');
var UserOnline = require('../models/useronline');
var sql = require('mssql');
var schedule = require('node-schedule');

var getExpiredSoonData = function(app, io) {
    var request = new sql.Request();
    request.execute('SV_MemberExpiredSoon_Count', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            _.each(result.recordsets, function(data) {
                if (data.length > 0) {
                    var _count = 0;
                    _.each(data, function(item) {
                        var dateText = 'sau' + item.ExpiredDays + ' ngày';
                        if (item.ExpiredDays == 0) dateText = 'hôm nay';

                        dateText = 'Tài khoản của bạn sẽ hết hạn ' + dateText + ', nạp thẻ ngay!';
                        var opts = {
                            title: 'Thông báo',
                            content: dateText,
                            payload: item,
                            is_web: true,
                            is_email: false,
                            is_app: true,
                            receive_user: item.MemberId,
                            type: config.Enum.NotificationType.MemberExpireSoon
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
                                return null;
                            }).catch(err => {
                                console.log(err);
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
        var j = schedule.scheduleJob('0 0 1 * * *', function() {
            console.log('service member expire soon notification processed!!!');
            getExpiredSoonData(app, io);
        });
        console.log('service member expire soon notification is running, it will process at: 01:00:00 AM');
    }, 2000);
};