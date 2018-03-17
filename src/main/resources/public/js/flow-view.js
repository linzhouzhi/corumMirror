/**
 * Created by lzz on 2018/2/25.
 */

$(document).on("click", ".ajax-ul", function () {
    var group = $(this).data("target");
    get('/group-list?group=' + group, function (obj) {
        var list = obj.res;
        var target = "#ul-" + group;
        $(target).empty();
        for(var i = 0; i < list.length; i++){
            var flow_name = list[i];
            var li_con = '<li><a data-url="/flow-view?group=' + group + '&flow_name=' + flow_name + '"  class="tab-link"><i class="fa fa-terminal"></i> ' + flow_name + '</a></li>';
            $( target ).append( li_con );
        }
    });
});



window.codeArr = [];
function init() {
    var codeArr = getCodeArr(window.flowData.nodeDataArray, window.flowData.linkDataArray);
    window.codeArr = codeArr;
    for(var i = 0; i < codeArr.length; i++ ){
        var category = codeArr[i].category;
        if( category != "Code" ){
            continue;
        }
        if( componentType(codeArr[i].text) == "json" || componentType(codeArr[i].text) == "string" ){
            $("#user-input").text( codeArr[i].text );
        }
    }
    init_step_list(codeArr);
}

$(document).on("click", "#step-list > li > a", function(){
    if( $(this).hasClass("selected") ){
        $(this).removeClass("selected");
    }else{
        $("#step-list > li > a").removeClass("selected");
        $(this).addClass("selected");
    }
    /*
    var left = $(this).css("left");
    var total_width = $("#step-list").width();
    var  scale_value = "scaleX(" + left.split("px")[0]/(total_width) + ")";
    $(".filling-line").css("transform", scale_value);
    */
});

function init_step_list(codeArr) {
    var total_width = $(".panel-body").width();
    var len = Math.round((total_width/codeArr.length));
    for(var i = 0; i < codeArr.length; i++){
        var left_offset = (i*len);
        console.log( left_offset );
        var li_str = '<li><a href="javascript:void(0)" data-key="' + codeArr[i].key + '" style="left: ' + left_offset + 'px;">' + get_componet_name(codeArr[i].text)+ '</a></li>';
        $("#step-list").append( li_str );
    }
}

$(document).on("click", "#user-run-flow", function () {
    $( this ).button('loading');
    clear();
    var codeArr = window.codeArr;
    window.business_res = $("#user-input").val();
    window.flow_step_index = 0;
    for(var i = 0; i < codeArr.length; i++ ){
        if( i == 0 && window.business_res != ""){ // 第一个为输入
            codeArr[i].text = window.business_res;
            codeArr[i].category = "Code";
        }
        step_run_flow(codeArr, i, window.business_group, window.business_name);
        if( codeArr[i].key == $("a.selected").data("key") ){
            $( this ).button( 'reset' );
            return;
        }
    }
    $("a[data-key='" + codeArr[codeArr.length-1].key + "']").click();
    $( this ).button( 'reset' );
});

function get_componet_name(con){
    var res = "";
    if( componentType(con) == "json" ){ // is json data
        res = "input";
    }else if( componentType(con) == "string" ){ // is string
        res = con.substring(0, 30);
    }else if( componentType(con) == "fun" ){
        var funCon = con.split("function")[1];
        res = funCon.split("(")[0];
    }else if(componentType(con) == "flow"){
        res = con.substring(0, 45);
    }else {
        res = con;
    }
    return res;
}