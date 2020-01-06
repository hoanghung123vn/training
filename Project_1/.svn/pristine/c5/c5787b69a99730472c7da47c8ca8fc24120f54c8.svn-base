if (typeof(DW) == 'undefined') DW = {};
DW.Notification = {
    Host: 'https://realtime.dekiru.vn/notification',
    //Host: 'http://localhost:3000/notification',
    Connection: null,
    Init: function(opts) {
        var _this = this;
        if (typeof(opts) == 'undefined') opts = {};
        if (typeof(opts.token) == 'undefined') {
            console.log('DW.Notification.Init missing parameter token!');
        }
        var defOpts = {
            onInit: function() {},
            onNotify: function() {},
            onUpdateSeen: function() {

            }
        }
        if (typeof(opts.onInit) == 'undefined') opts.onInit = defOpts.onInit;
        if (typeof(opts.onNotify) == 'undefined') opts.onNotify = defOpts.onNotify;
        if (typeof(opts.onUpdateSeen) == 'undefined') opts.onUpdateSeen = defOpts.onUpdateSeen;
        if (typeof(opts.onUpdateRead) == 'undefined') opts.onUpdateRead = defOpts.onUpdateRead;

        var notification = io.connect(_this.Host);

        notification.on('connect', function() {
            notification
                .emit('authenticate', { token: opts.token })
                .on('authenticated', function() {
                    //notification.emit('send', { message: 'join notification!' });
                    _this.Connection = notification;
                })
                .on('unauthorized', function(msg) {
                    console.log("unauthorized: " + JSON.stringify(msg.data));
                });
        });

        notification.on('init', function(data) {
            console.log('init');
            opts.onInit(data);
        });

        notification.on('error', function(data) {
            console.log('err', data);
        });

        notification.on('notify', function(data) {
            console.log('receive notify');
            opts.onNotify(data);
        });

        notification.on('update_seen', function(data) {
            console.log('on update seen 1');
            opts.onUpdateSeen(data);
        });

        notification.on('update_read', function(data) {
            console.log('on update read 1');
            opts.onUpdateRead(data);
        });

    },
    MarkSeen: function() {
        if (this.Connection != null)
            this.Connection.emit('mark_seen', {});
    },
    MarkRead: function(id) {
        if (this.Connection != null)
            this.Connection.emit('mark_read', id);
    }
};