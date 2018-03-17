/**
 * Created by lzz on 2018/2/1.
 */


function post(url, data, callback, errorcall) {
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: callback,
        error:errorcall,
        beforeSend:function(XMLHttpRequest){
            //show_loading();
        },
        complete:function(XMLHttpRequest){
            //hide_loading();
        }
    });
}

function show_loading() {
    var con = '<div class="loading" id="page-loading">' +
        '<div class="gif"></div>' +
        '</div>';
    $(document.body).append(con);
}

function hide_loading() {
    $("#page-loading").remove();
}

function get(url, callback) {
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: callback
    });
}

function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

function syntaxHighlight(json) {
    if( typeof json == 'undefined'){
        return "";
    }
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function isJson(data) {
    try {
        var obj=JSON.parse(data);
        return true;
    } catch(e) {
        return false;
    }
}

function jsString(data) {
    return /^"/.test(data);
}

function  isInt(data) {
    var format = /^(-)?\d+(\.\d+)?$/;
    if (format.exec(data) == null || data == "") {
        return false
    } else {
        return true
    }
}

function isBool(data) {
    return /true|false/.test( data );
}

function drag(target) {
    //移动窗口的步骤
    //1、按下鼠标左键
    //2、移动鼠标
    $(target).mousedown(function(e){
        // e.pageX
        var positionDiv = $(this).offset();
        var distenceX = e.pageX - positionDiv.left;
        var distenceY = e.pageY - positionDiv.top;
        //alert(distenceX)
        // alert(positionDiv.left);
        $(document).mousemove(function(e){
            var x = e.pageX - distenceX;
            var y = e.pageY - distenceY;
            if(x<0){
                x=0;
            }else if(x>$(document).width()-$(target).outerWidth(true)){
                x = $(document).width()-$(target).outerWidth(true);
            }
            if(y<0){
                y=0;
            }else if(y>$(document).height()-$(target).outerHeight(true)){
                y = $(document).height()-$(target).outerHeight(true);
            }
            if( y < 30 ){
                y = 30;
            }
            $(target).css({
                'left':x+'px',
                'top':y+'px'
            });
        });
        $(document).mouseup(function(){
            $(document).off('mousemove');
        });
    });    
}


$.fn.autoTextarea = function(options) {
    var defaults={
        maxHeight:null,
        minHeight:$(this).height()
    };
    var opts = $.extend({},defaults,options);
    return $(this).each(function() {
        $(this).bind("paste cut keydown keyup focus blur",function(){
            var height,style=this.style;
            this.style.height =  opts.minHeight + 'px';
            if (this.scrollHeight > opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight;
                    style.overflowY = 'scroll';
                } else {
                    height = this.scrollHeight;
                    style.overflowY = 'hidden';
                }
                style.height = height  + 'px';
            }
        });
    });
};