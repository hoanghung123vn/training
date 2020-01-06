if (typeof(DW) == 'undefined') DW = {};
DW.Chat = {
    Host: realtimeDomain + '/chat',
    Connection: null,
    ActiveConversationId: '',
    EnableScroll: true,
    IsActiveWindows: false,
    InitTitle: 'Hỗ trợ trực tuyến',
    BlinkTitleInterval: null,
    ProcessUI: function() {
        var _this = this;
        _this.InitEmoticon();
        _this.UploadManager.Init();
        document.execCommand('defaultParagraphSeparator', false, 'p');
        _this.Editor.placeCaretAtEnd($('#dchat-input-area').get(0));
        $('#dchat-input-area').blur();
        $('#dchat-left, #dchat-right').css({
            height: $(window).height()
        });
        $('#dchat-left-conversation-list-wrapper').css({
            height: $(window).height() - $('#dchat-left-header').height()
        });

        $('#dchat-info').css({
            height: $(window).height()
        });

        $('#dchat-message-list').css({
            height: $(window).height() - 50 - 50
        });

        $('#dchat-show-hide-info').off('click').on('click', function() {
            $(this).toggleClass('active');
            $('#dchat-info').toggleClass('active');
            $('#dchat-main-left').toggleClass('minimized');
        });

        $('#dchat-filter-conversation').off('click').on('click', function() {
            $(this).toggleClass('active');
            $('#dchat-filter-select').toggleClass('active');
        });

        $("[contenteditable='true']").off('focus').on('focus', function() {
            var $this = $(this);
            if ($('br', $this).length == 0 && $.trim($this.text()) == '' && $('.emoticon', $this).length == 0) {
                $this.html($this.html() + '<br/>'); // firefox hack
            }
        });

        $("[contenteditable='true']").off('blur').on('blur', function() {
            _this.Editor.saveSelection();
            var element = $(this);
            if (!element.text().trim().length && $('.emoticon', element).length == 0) {
                element.empty();
            }
        });

        $('#dchat-input-func span.emoticon').off('click').on('click', function() {
            $(this).toggleClass('active');
            $('.dchat-popbox.pre-message-select').addClass('popbox-hide');
            $('.dchat-popbox.emoticon-select').toggleClass('popbox-hide');
        });

        $('#dchat-input-func span.pre-message').off('click').on('click', function() {
            _this.InitPreMessage({
                fullname: $('#dchat-right-header h3').text()
            });
            $(this).toggleClass('active');
            $('.dchat-popbox.emoticon-select').addClass('popbox-hide');
            $('.dchat-popbox.pre-message-select').toggleClass('popbox-hide');
        });

        // $('#dchat-input-func span.attach').off('click').on('click', function() {
        //     $(this).toggleClass('active');
        //     $('.dchat-popbox').toggleClass('popbox-hide');
        // });

        $('#dchat-message-list').on('scroll', function(event) {
            var element, height, scrollHeight, scrollTop;
            element = $(this);
            scrollTop = element.scrollTop();
            scrollHeight = element.prop('scrollHeight');
            height = element.height();
            //console.log('scrollTop', scrollTop);
            if (scrollTop < scrollHeight - height - 50) {
                _this.EnableScroll = false;
            }
            if (scrollTop > scrollHeight - height - 30) {
                _this.EnableScroll = true;
            }
        });
        $(window).on("blur focus", function(e) {
            var prevType = $(this).data("prevType");
            if (prevType != e.type) {
                switch (e.type) {
                    case "blur":
                        _this.IsActiveWindows = false;
                        break;
                    case "focus":
                        _this.IsActiveWindows = true;
                        break;
                }
            }
            $(this).data("prevType", e.type);
        });
    },
    InitDesktopNotify: function() {
        if (isInIframe()) {
            parent.postMessage(JSON.stringify({
                type: 'request-notify-permission'
            }), parentDomain);
        } else {
            if (!Notification) {
                return;
            }
            if (Notification.permission !== "granted")
                Notification.requestPermission();
        }
    },

    InitFileViewer: function() {
        var _this = this;
        $('.dchat-message-item-child.upload-done').off('click').on('click', function() {
            var url = $(this).attr('data-file-url');
            if (url != '') {
                var ext = getExtentionOnly(url);
                window.open(storageDomain + url);
            }
        });
    },
    InitPreMessage: function(opts) {
        var _this = this;
        var msgs = [{
            title: 'Tôi không thể trò chuyện lúc này',
            msg: 'Xin chào ##fullname##, cảm ơn bạn đã liên hệ. Tôi không thể trò chuyện lúc này nhưng tôi sẽ liên hệ lại với bạn sớm nhất có thể!'
        }, {
            title: 'Tôi có thể giúp gì cho bạn?',
            msg: 'Xin chào ##fullname##, cảm ơn bạn đã liên hệ. Tôi có thể giúp gì cho bạn?'
        }];
        var html = '';
        $.each(msgs, function(i, item) {
            html += '<li><b>' + item.title.replace(/##fullname##/gi, opts.fullname) + '</b><p>' + item.msg.replace(/##fullname##/gi, opts.fullname) + '</p></li>';
        });
        $('#dchat-pre-message-select').html(html);
        $('#dchat-pre-message-select li').off('click').on('click', function() {
            var msg = $.trim($(this).find('p').text());
            var tempId = 'msg_' + new Date().getTime();
            var $lastMsg = $('.dchat-message-item:last');
            var parent_id = '';
            if ($lastMsg.hasClass('my-message')) {
                parent_id = $lastMsg.attr('data-id');
            }
            var opts = {
                conversation_id: _this.ActiveConversationId,
                content: msg,
                text: msg,
                type: 1,
                avatar: global_member.avatar,
                temp_id: tempId,
                parent_id: parent_id
            };
            _this.Connection.emit('message', opts);
            opts.is_my_message = true;
            _this.AppendMessage(opts);
            $('.pre-message-select').addClass('popbox-hide');
        });
    },
    UploadManager: {
        MaxFileSize: 20971520,
        Exts: 'jpg|jpeg|png|gif|zip|rar',
        Init: function() {
            var _this = this;
            var calculateProgress, cancelAllUploads, cancelUpload, createProgressBar,
                fileName, files, startAllUploads, startUpload;

            files = [];

            calculateProgress = function(data) {
                var value;
                value = parseFloat(data.loaded / data.total * 100, 10).toFixed(2) || 0;
                return value + "%";
            };

            fileName = function(data) {
                return data.files[0].name;
            };

            cancelUpload = function(index) {
                if (files[index]) {
                    files[index].jqXHR.abort();
                }
            };

            startUpload = function(index) {
                var context, data;
                data = files[index];
                context = data.context;
                data.uploadedBytes = parseInt($(context).attr("uploadedBytes"), 10);
                data.data = null;
                $(data).submit();
            };

            cancelAllUploads = function() {
                $(files).each(function(index, file) {
                    cancelUpload(index);
                });
            };

            startAllUploads = function() {
                $(files).each(function(index, data) {
                    startUpload(index);
                });
            };

            createProgressBar = function(progress) {
                return '<span class="bar" style="width: ' + progress + '">' + progress + '</span>';
            };
            $("#dchat-file-select").fileupload({
                url: storageServiceUrl + '?fn=upload',
                autoUpload: false,
                add: function(e, data) {
                    //console.log(data);
                    var fname = data.files[0].name;
                    var ext = getExtentionOnly(fname);
                    var allowsExt = _this.Exts.split('|');
                    if (allowsExt.length > 0) {
                        if ($.inArray(ext.toLowerCase(), allowsExt) == -1) {
                            return alert('Chỉ cho phép upload các định dạng: ' + _this.Exts.replace(/\|/g, ';'));
                        }
                    }
                    if (data.files[0].size > _this.MaxFileSize) {
                        return alert('Dung lượng file tối đa cho phép là 20MB!');
                    }

                    DW.Chat.Post({
                        data: {
                            filename: fname
                        },
                        url: '/chat/file-token',
                        //action: "get_token",
                        callback: function(data2) {
                            if (typeof(data2) == 'string') data2 = JSON.parse(data2);
                            data.formData = data2;
                            //console.log(data2);
                            var tempId = 'upload' + (new Date().getTime());
                            var tempIdData = 'msg_' + new Date().getTime();
                            data.tempId = tempId;
                            //$('#FMHtml5Files').append('<tr><td style="width:150px;">' + fname + '</td><td><div class="upload_loading" id="' + tempId + '"></div></td></tr>');                            

                            var $lastMsg = $('.dchat-message-item:last');
                            var parent_id = '';
                            if ($lastMsg.hasClass('my-message')) {
                                parent_id = $lastMsg.attr('data-id');
                            }
                            var sizeText = bytesToSize(data.files[0].size);
                            var opts = {
                                conversation_id: DW.Chat.ActiveConversationId,
                                content: fname + ' (' + sizeText + ')',
                                text: fname + ' (' + sizeText + ')',
                                type: 2,
                                avatar: global_member.avatar,
                                temp_id: tempIdData,
                                parent_id: parent_id,
                                payload: {
                                    size: data.files[0].size,
                                    ext: ext,
                                    url: '',
                                    id: tempId,
                                    status: 0
                                }
                            };
                            DW.Chat.Connection.emit('message', opts);
                            $(this).html('<br/>');
                            opts.is_my_message = true;
                            DW.Chat.AppendMessage(opts);

                            data.process().done(function() {
                                data.submit();
                            });
                        }
                    });
                },
                done: function(e, data) {
                    console.log(data.tempId);
                    if (typeof(data.result) == 'string') data.result = JSON.parse(data.result);
                    var doneInterval = setInterval(function() {
                        var message_id = $('.dchat-message-item-child[data-temp-file-id="' + data.tempId + '"]').attr('data-id');
                        if (message_id == '') {
                            message_id = $('.dchat-message-item-child[data-temp-file-id="' + data.tempId + '"]').parents('.dchat-message-item').attr('data-id');
                        }
                        console.log(message_id);
                        if (message_id != '') {
                            clearInterval(doneInterval);
                            DW.Chat.Connection.emit('message upload success', {
                                conversation_id: DW.Chat.ActiveConversationId,
                                id: data.tempId,
                                url: data.result.path,
                                message_id: message_id
                            });
                        }
                    }, 100);
                },
                success: function(response, status) {
                    if (typeof(response) == 'string') response = JSON.parse(response);
                    var _file = {
                        size: response.size,
                        ext: response.ext,
                        path: response.path
                    };
                },
                progress: function(e, data) {
                    $('#' + data.tempId).html(createProgressBar(calculateProgress(data)));
                },
                fail: function() {
                    console.log('fail');
                },
                stop: function() {
                    console.log('stopped');
                }
            });
        }
    },
    InitEmoticon: function() {
        var _this = this;

        var temps = {};
        $.each(skypeEmo, function(i, item) {
            var key = item.title.toLowerCase();
            key = key.split(' ').join('').replace(/\./g, '').replace(/'/g, '').replace(/!/g, '');
            item.code = item.code.replace(/  +/g, ' ');
            temps[key] = {
                title: item.title,
                codes: item.code.split(' '),
                img: item.image
            }
        });
        var html = '';
        var css = '';
        $.each(temps, function(i, item) {
            html += '<li data-codes="' + item.codes.join(',') + '" title="' + item.title + '"><span class="emoticon emoticon-' + i + '"></span></li>';
            css += '.emoticon.emoticon-' + i + '{background:("/images/emoticons/01/' + item.img + '");}'
        });

        $('#dchat-emoticon-select').html(html);
        $('#dchat-emoticon-select li').off('click').on('click', function() {
            var code = $(this).attr('data-codes').split(',')[0];
            _this.Editor.insertTextAtCursor(code + ' ');
        });
        $.emoticons.define(temps);
    },
    CurrentSelection: null,
    Editor: {
        saveSelection: function() {
            var _this = this;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    _this.CurrentSelection = sel.getRangeAt(0);
                }
            } else if (document.selection && document.selection.createRange) {
                _this.CurrentSelection = document.selection.createRange();
            }
            _this.CurrentSelection = null;
        },

        restoreSelection: function(range) {
            var _this = this;
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        },
        insertTextAtCursor: function(text) {
            $('#dchat-input-area').get(0).focus();
            if ($.trim($('#dchat-input-area').text()) == '' && $('.emoticon', $('#dchat-input-area')).length == 0) {
                $('#dchat-input-area').empty();
            }
            text = $.emoticons.replace(text);
            text = text + '&nbsp;';
            //_this.Editor.restoreSelection(_this.CurrentSelection);
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.collapse(false);
                    range.deleteContents();
                    var div = document.createElement('div');
                    div.innerHTML = text;
                    var frag = document.createDocumentFragment(),
                        node, lastNode;
                    while ((node = div.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                    // Preserve the selection
                    // if (lastNode) {
                    //     expandedSelRange.setEndAfter(lastNode);
                    //     sel.removeAllRanges();
                    //     sel.addRange(expandedSelRange);
                    // }
                } else {
                    $('#dchat-input-area').html(text);
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().html = text;
            } else {
                $('#dchat-input-area').html(text);
            }
            this.placeCaretAtEnd($('#dchat-input-area').get(0));

        },
        placeCaretAtEnd: function(el) {
            try {
                el.focus();
                if (typeof window.getSelection != "undefined" &&
                    typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            } catch (e) {}
        }
    },
    Notifies: [],
    AppendMessage: function(opts) {
        var _this = this;
        //Nếu message ở chính cửa sổ đang chat thì không append thêm nữa
        if ($('.dchat-conversation-item[data-id="' + opts.conversation_id + '"]').length == 0) {
            _this.GetConversations(false);
        } else {
            $('.dchat-conversation-item[data-id="' + opts.conversation_id + '"] i').html(opts.content);
            if ($('[data-id="' + opts._id + '"]').length == 0) {
                if (_this.ActiveConversationId == opts.conversation_id) {
                    var template = '';
                    var messages = [];
                    var cls = '';
                    if (opts.is_my_message) {
                        opts.cls = 'my-message';
                    }
                    if (opts.avatar.lastIndexOf('DekiruCharAvatar://') != -1) {
                        opts.avatar = opts.avatar.split('DekiruCharAvatar://')[1];
                        opts.avatarCls = 'DekiruCharAvatar';
                    }
                    opts.is_file = false;
                    if (opts.type == 2)
                        opts.is_file = true;
                    messages.push(opts);
                    if (opts.parent_id == '' || opts.parent_id == null) {
                        template = _this.MessageTemplate({
                            messages: messages
                        });
                        $('#dchat-message-list').append($.emoticons.replace(template));
                    } else {
                        template = _this.MessageChildTemplate({
                            child_messages: messages
                        });
                        $('#dchat-message-list .dchat-message-item[data-id="' + opts.parent_id + '"] ul').append($.emoticons.replace(template));
                    }
                    _this.CheckEmoticon();
                    $('.DekiruCharAvatar').initAvatar();
                    _this.ScrollToBottom();
                }
            }
        }
        if (!_this.IsActiveWindows && !opts.is_my_message) {
            clearInterval(_this.BlinkTitleInterval);
            var isOldTitle = true;
            var oldTitle = _this.InitTitle;
            var newTitle = opts.text;

            function changeTitle() {
                document.title = isOldTitle ? oldTitle : newTitle;
                isOldTitle = !isOldTitle;
            }
            _this.BlinkTitleInterval = setInterval(changeTitle, 700);

            $(window).focus(function() {
                clearInterval(_this.BlinkTitleInterval);
                $("title").text(oldTitle);
            });

            if (!isMacintosh()) {
                $.playSound('/sounds/newmsg.mp3');
            }
            if (isInIframe()) {
                parent.postMessage(JSON.stringify({
                    type: 'show-notify',
                    payload: {
                        title: $('#dchat-right-header').text(),
                        body: opts.text
                    }
                }), parentDomain);
            } else {
                if (!Notification) {
                    return;
                }
                if (Notification.permission !== "granted")
                    Notification.requestPermission();
                else {
                    if (_this.Notifies.length > 0) {
                        for (n in _this.Notifies) {
                            try {
                                _this.Notifies[n].close();
                            } catch (e) {

                            }
                        }
                        _this.Notifies = [];
                    }
                    var notification = new Notification('Tin nhắn mới', {
                        icon: 'images/email_notify.png',
                        body: opts.text,
                    });
                    _this.Notifies.push(notification);
                }
            }
        }
    },
    CheckEmoticon: function() {
        $('.dchat-message-item-child').each(function() {
            if ($.trim($(this).text()) == $.trim($('.emoticon', $(this)).text())) {
                $(this).addClass('emoticon-only');
            }
        });
    },
    OldScrollPosition: 0,
    ScrollToBottom: function() {
        var _this = this;
        var msgDiv = $('#dchat-message-list').get(0);
        if (_this.EnableScroll) {
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }
    },
    InitTemplate: function() {
        var _this = this;
        var source_child = $("#message-child-template").html();
        Handlebars.registerPartial('message-child', source_child);
        var source = $("#message-template").html();
        _this.MessageTemplate = Handlebars.compile(source);
        _this.MessageChildTemplate = Handlebars.compile(source_child);
    },
    Init: function(opts) {
        var _this = this;
        _this.InitTemplate();
        _this.ProcessUI();
        _this.GetConversations();
        _this.InitDesktopNotify();

        var timeoutResize = null;
        $(window).on('resize', function() {
            clearTimeout(timeoutResize);
            timeoutResize = setTimeout(function() {
                _this.ProcessUI();
            }, 100);
        });

        $('#dchat-input-area').off('paste').on('paste', function(e) {
            var pasteData = e.originalEvent.clipboardData.getData('text');
            pasteData = pasteData.replace(/&nbsp;/g, ' ');
            e.preventDefault();
            document.execCommand("insertHTML", false, pasteData);
        });
        var autolinker = new Autolinker({
            urls: {
                schemeMatches: true,
                wwwMatches: true,
                tldMatches: true
            },
            email: true,
            phone: true,
            mention: false,
            hashtag: false,

            stripPrefix: false,
            stripTrailingSlash: false,
            newWindow: true,

            truncate: {
                length: 0,
                location: 'end'
            },

            className: 'dekiru-auto-link'
        });

        $('#dchat-input-area').off('keydown').on('keydown', function(evt) {
            if (evt.keyCode == 13) {
                var value = $.trim($(this).html());
                if (value.length > 500) return alert('Nội dung quá dài! Cho phép tối đa 500 ký tự/ tin nhắn.');
                value = $.emoticons.replace(value);
                var txt = $.trim($(this).text());
                if (txt == '' && $('.emoticon', $(this)).length == 0) return;
                var tempId = 'msg_' + new Date().getTime();
                var $lastMsg = $('.dchat-message-item:last');
                var parent_id = '';
                if ($lastMsg.hasClass('my-message')) {
                    parent_id = $lastMsg.attr('data-id');
                }
                value = autolinker.link(value);
                var opts = {
                    conversation_id: _this.ActiveConversationId,
                    content: value,
                    text: txt,
                    type: 1,
                    avatar: global_member.avatar,
                    temp_id: tempId,
                    parent_id: parent_id
                };
                _this.Connection.emit('message', opts);
                $(this).html('<br/>');
                opts.is_my_message = true;
                _this.AppendMessage(opts);
                evt.preventDefault();
                return false;
            }
        });

        // $('#dchat-input-area').off('keypress').on('keypress', function(evt) {
        //     $(this).html($.emoticons.replace($(this).html()));
        // });

        /*********************************** */
        if (typeof(opts) == 'undefined') opts = {};
        if (typeof(opts.token) == 'undefined') {
            console.log('DW.Chat.Init missing parameter token!');
        }
        var defOpts = {
            onInit: function() {},
            onMessage: function() {},
            onTyping: function() {},
            onUpdateRead: function() {}
        }
        if (typeof(opts.onInit) == 'undefined') opts.onInit = defOpts.onInit;
        if (typeof(opts.onMessage) == 'undefined') opts.onMessage = defOpts.onMessage;

        var chat = io.connect(_this.Host);

        chat.on('connect', function() {
            chat
                .emit('authenticate', { token: opts.token })
                .on('authenticated', function() {
                    //chat.emit('send', { message: 'join chat!' });
                    _this.Connection = chat;
                })
                .on('unauthorized', function(msg) {
                    console.log("unauthorized: " + JSON.stringify(msg.data));
                });
        });

        chat.on('init', function(data) {
            console.log('init');
            opts.onInit(data);
        });

        chat.on('error', function(data) {
            console.log('err', data);
        });

        // chat.on('message', function(data) {
        //     console.log('receive message');
        //     opts.onMessage(data);
        // });
        chat.on('message receive', function(data) {
            console.log('receive message');
            _this.AppendMessage(data);
        });

        chat.on('message upload success', function(data) {
            console.log('message upload success');
            $('[data-temp-file-id="' + data.id + '"]')
                .addClass('upload-done')
                .attr('data-file-url', data.url);
            _this.InitFileViewer();
        });

        chat.on('message success', function(data) {
            //console.log('message success', data);
            var $obj = $('[data-temp-id="' + data.temp_id + '"]');
            $obj.attr('data-id', data._id)
                .attr('data-temp-id', '');
            //opts.onMessageSuccess(data);
        });

        chat.on('message error', function(data) {
            console.log('message error', data);
            //opts.onMessageError(data);
        });

        chat.on('update_read', function(data) {
            console.log('on update read');
            opts.onUpdateRead(data);
        });
    },
    MarkRead: function(id) {
        if (this.Connection != null)
            this.Connection.emit('mark_read', id);
    },
    GetConversations: function(isLoadFirstConversation) {
        var _this = this;
        if (typeof(isLoadFirstConversation) == 'undefined') isLoadFirstConversation = true;
        _this.Post({
            url: '/chat/conversation',
            callback: function(data) {
                $('#dchat-left-conversation-list').append(data);
                $('.DekiruCharAvatar').initAvatar();
                _this.TimeAgo();
                if (isLoadFirstConversation) {
                    var lastestConversation = $('.dchat-conversation-item:eq(0)').attr('data-id');
                    if (lastestConversation) {
                        _this.DetailConversation(lastestConversation);
                    }
                }
                $('#dchat-left-conversation-list li.dchat-conversation-item').off('click').on('click', function() {
                    var id = $(this).attr('data-id');
                    _this.DetailConversation(id);
                });
            }
        });
    },
    DetailConversation: function(conversation_id) {
        var _this = this;
        _this.ActiveConversationId = conversation_id;
        $('.dchat-conversation-item').removeClass('active');
        var $item = $('.dchat-conversation-item[data-id="' + conversation_id + '"]');
        $item.addClass('active');
        var title = $('b', $item).text();
        $('#dchat-right-header h3').text(title);
        _this.GetMessages(conversation_id);
        _this.ShowUserInfo(conversation_id);
        $('.dchat-popbox').addClass('popbox-hide');
        _this.MarkRead(conversation_id);
    },
    ShowUserInfo: function(conversation_id) {
        var _this = this;
        _this.Post({
            url: '/chat/member/info',
            data: {
                conversation_id: conversation_id
            },
            callback: function(data) {
                $('#dchat-info-detail').html(data);

                function registerSubEvents() {
                    $('.delete-note').off('click').on('click', function() {
                        var id = $(this).parents('.note-item').attr('data-id');
                        _this.Post({
                            url: '/chat/note/remove',
                            data: {
                                id: id
                            },
                            callback: function(data) {
                                $('.note-item[data-id="' + id + '"]').fadeOut();
                            }
                        });
                    });
                }
                registerSubEvents();
                $('#show-add-note').off('click').on('click', function() {
                    $('#add-note').show();
                });
                $('#cancel-note').off('click').on('click', function() {
                    $('#add-note').hide();
                    $('#note-txt').val('');
                });

                $('#add-note-btn').off('click').on('click', function() {
                    _this.Post({
                        url: '/chat/note/add',
                        data: {
                            conversation_id: conversation_id,
                            content: $('#note-txt').val()
                        },
                        callback: function(data) {
                            $('#list-note').append('<div class="note-item" data-id="' + data._id + '">\
                                                        <b>' + data.content + '</b><span class="btn btn-link delete-note no-margin no-padding">Xóa</span></p>\
                                                    </div>');
                            $('#note-txt').val('');
                            $('#add-note').hide();
                            registerSubEvents();
                        }
                    });
                });
            }
        });
    },
    GetMessages: function(conversation_id) {
        var _this = this;
        $("body").loading({
            theme: 'dark',
            message: 'Đang tải dữ liệu...'
        });
        _this.Post({
            url: '/chat/message',
            data: {
                conversation_id: conversation_id
            },
            callback: function(data) {
                $('#dchat-message-list').html(data);
                $('#dchat-message-list .DekiruCharAvatar').initAvatar();
                $('.dchat-message-item-child>span').each(function() {
                    $(this).html($.emoticons.replace($(this).html()));
                });
                _this.CheckEmoticon();
                _this.ScrollToBottom();
                _this.InitFileViewer();
                $("body").loading('stop');
            }
        });
    },
    TimeAgo: function() {
        //$("time.timeago").timeago();
    },
    Post: function(opts) {
        var params = {
            token: global_token
        };
        params = $.extend({}, params, opts.data);
        params.action = opts.action;
        $.ajax({
            url: opts.url,
            data: params,
            xhrFields: { withCredentials: true },
            type: "POST",
            success: function(response) {
                if (typeof(opts.callback) == "function") opts.callback(response);
            }
        });
    }
};


$(function() {
    if (global_token) {
        DW.Chat.Init({
            token: global_token,
            onInit: function(data) {
                console.log(data);
            }
        })
    }
});