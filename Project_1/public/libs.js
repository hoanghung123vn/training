/*libs */
function getNameOnly(filename) {
    return filename.replace(/.[^.]+$/, '');
}

function getExtentionOnly(fileext) {
    return fileext.split('.').pop();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var uploadManager = {
    options: {
        $el: null,
        onSuccess: null,
        onAdd: function(e, data) {},
        onError: null,
        $progressbar: null,
        $numbPercent: null,
        xhr: null,
        $btnCancel: null,
        $txtFile: null
    },
    init: function(o) {
        var me = this;
        me.options = $.extend(me.options, o);
        //console.log(me.options.$progressbar);
        var $percent = null;
        if (me.options.$progressbar != null) {
            $percent = me.options.$progressbar.find('div');
        }

        me.options.$el.fileupload({
            url: 'https://storage.dekiru.vn/FileManagerServices.ashx?fn=upload',
            autoUpload: false,
            add: function(e, data) {
                var boolValue = me.options.onAdd(e, data);
                if (boolValue) {
                    return;
                }
                //console.log(me.options.$progressbar);
                if (me.options.$progressbar != null) me.options.$progressbar.show();
                if (me.options.$btnCancel) {
                    me.options.$btnCancel.show();
                }
                $.ajax({
                    dataType: 'json',
                    method: "GET",
                    data: {
                        filename: data.files[0].name
                    },
                    url: '/chat/get-file-token',
                    success: function(res) {
                        data.formData = res;
                        data.process().done(function() {
                            me.options.xhr = data.submit();
                            if (me.options.$btnCancel) {
                                me.options.$btnCancel.click(function() {
                                    data.abort();
                                    $(this).hide();
                                    if (me.options.$numbPercent) me.options.$numbPercent.hide();
                                    if (me.options.$txtFile) me.options.$txtFile.html('');
                                });
                            }
                        });
                    },
                    error: function(a) {
                        console.log(a.error);
                    }
                });
            },
            progress: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                //console.log(me.options.$progressbar.find('div'));
                if ($percent != null) $percent.css('width', progress + '%');
                if (me.options.$numbPercent && progress > 20) {
                    me.options.$numbPercent.html(progress + "%");
                    me.options.$numbPercent.show();
                }


            },
            success: function(response, status) {
                if (me.options.$progressbar != null) {
                    $percent.css('width', '100%');
                    setTimeout(function success() {
                        me.options.$progressbar.hide();
                        me.options.$progressbar.find('div').css('width', '0%');
                    }, 1000);

                }
                if (me.options.$btnCancel) {
                    me.options.$btnCancel.hide();
                }
                if (typeof(me.options.onSuccess) == "function") me.options.onSuccess(response, status);
            },
            error: function(error) {
                if (me.options.$progressbar) {
                    me.options.$progressbar.hide();
                    me.options.$progressbar.find('div').css('width', '0%');
                }
                if (typeof(me.options.onError) == "function") me.options.onError(error);
            }
        });
    }
};

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1
}

function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

(function($) {
    $.extend({
        playSound: function() {
            var audio = new Audio(arguments[0]);
            audio.play();
            // var tempId = 'sound' + new Date().getTime();
            // var $obj = $(
            //     '<audio id="' + tempId + '" class="sound-player" autoplay="autoplay" style="display:none;">' +
            //     '<source src="' + arguments[0] + '" />' +
            //     '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>' +
            //     '</audio>'
            // ).appendTo('body');
            // setTimeout(function() {
            //     $('#' + tempId).remove();
            // }, 1000);
        },
        stopSound: function() {
            //$(".sound-player").remove();
        }
    });
})(jQuery);