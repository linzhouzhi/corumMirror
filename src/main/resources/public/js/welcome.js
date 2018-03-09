/**
 * Created by lzz on 2018/2/1.
 */

$(document).ready(function () {
    var tarurl = getQueryString("q");
    var history_list = getPostHistory();
    history_list.forEach(function (value, index) {
        var urlobj = JSON.parse(value);
        if( urlobj.requet_url == tarurl ){
            console.log(urlobj);
            console.log("aaaa");
            $('[name="request-url"]').val( urlobj.requet_url );
            $('[name="request-body"]').val( urlobj.request_body );
        }
    });

});

function  getPostHistory() {
    var hisotry_str = get_cookie("post_history");
    var history_list = [];
    if( hisotry_str != null ){
        history_list = hisotry_str.split("|");
    }
    history_list = unique(history_list);
    return history_list;
}

$("#post-url").click(function () {
    var data={};
    data.requet_url = $('[name="request-url"]').val();
    data.request_body = $('[name="request-body"]').val();

    try {
        var history_list = getPostHistory();
        history_list.push(JSON.stringify(data));
        set_cookie("post_history", history_list.join("|"));
    }catch (err){
        console.log(err);
    }

});


$(".post-type").click(function () {
    var postType = $(this).text();
    $("#post-type").text( postType );
});

$("#confirm-button").click(function () {
    var url = $(this).data("url");
    $.get(url, function (res) {
        console.log(res);
        $('#confirm-model').modal('hide');
    });
});

function confirm(url, content) {
    $("#confirm-content").text(content);
    $("#confirm-button").data("url", url);
    $('#confirm-model').modal('show');
}
