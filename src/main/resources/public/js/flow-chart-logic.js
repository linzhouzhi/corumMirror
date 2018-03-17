/**
 * Created by lzz on 2018/2/20.
 */

$(document).ready(function () {
    $("[data-toggle='popover']").popover();
    $('[data-toggle="tooltip"]').tooltip();
    drag(".drag");
    $("[name='modal-flow-group']").autocomplete({
        source: "/flow-list"
    });
});

window.business_res = "";
window.flow_step_index = 0;

$(document).on("click", "#repeat-flow-chart", function () {
    window.flow_step_index = 0;
    clear();
});

$(document).on("click", "#run-flow-chart", function () {
    clear();
    window.business_res = "";
    window.flow_step_index = 0;
    var codeArr = getCodeArr(diagram.model.nodeDataArray, diagram.model.linkDataArray);
    for(var i = 0; i < codeArr.length; i++ ){
        window.flow_step_index++;
        step_run_flow(codeArr, i, window.business_group, window.business_name);
        if( codeArr[i].key == getSelect() ){
            return;
        }
    }
    window.flow_step_index = 0;
    select_node( codeArr[ codeArr.length - 1 ].key );
});

$(document).on("click", "#step-run-flow-chart", function () {
    if( window.flow_step_index == 0 ){
        clear();
        window.business_res = "";
    }
    var codeArr = getCodeArr(diagram.model.nodeDataArray, diagram.model.linkDataArray);
    if( window.flow_step_index >= codeArr.length ){
        window.flow_step_index = 0;
        showResult( "finish \n");
        return;
    }
    step_run_flow(codeArr, window.flow_step_index, window.business_group, window.business_name);
    select_node( codeArr[flow_step_index].key );
    window.flow_step_index++;
    if( window.flow_step_index == codeArr.length ){
        window.business_res = "";
    }

});

function run_flow_chart(nodeDataArray, linkDataArray, group, flow_name) {
    var codeArr = getCodeArr(nodeDataArray, linkDataArray);
    run_flow_arr(codeArr, group, flow_name);
}

function run_flow_arr(codeArr, group, flow_name) {
    for(var i = 0; i < codeArr.length; i++ ){
        step_run_flow(codeArr, i, group, flow_name);
    }
}

function step_run_flow(codeArr, i, group, flow_name_tag) {
    if( i == 0 ){
        if( flow_name_tag ){
            showResult( "<b class='flow-title'>---------------- " + group + ":" + flow_name_tag + " ----------------</b><br/>");
        }
    }
    var codeText = codeArr[i].text;
    var category = codeArr[i].category;
    if( category != "Code" && category.indexOf("custom") != 0 ) {
        return;
    }

    if( componentType( codeText ) == "flow" ){
        var codeArr = codeText.split("|");
        for(var n = 0; n < codeArr.length; n++){
            if( n == 0 ){
                window.business_res_bak = window.business_res;
            }else{
                window.business_res = window.business_res_bak;
            }
            var flow_name = codeArr[n].split("#")[1];
            if( flow_name == window.business_name ){
                return; // 避免递归
            }
            if( flow_name.indexOf(":") > 0 ){
                group = flow_name.split(":")[0];
                flow_name = flow_name.split(":")[1];
            }
            get("/flow-detail?group=" + group + "&name=" + flow_name,function (result) {
                console.log( flow_name_tag + "&name=" + flow_name );
                var jsonObj = JSON.parse(result.res);
                run_flow_chart( jsonObj.nodeDataArray, jsonObj.linkDataArray, group, flow_name);
            });
        }
    }

    var funCon = codeText;
    if( componentType(funCon) == "json" ){ // is json data
        if( componentType( window.business_res ) != "json" ){ // if json input json component
            window.business_res = funCon;
        }
    }else if( componentType(funCon) == "string" ){ // is string
        if( componentType( window.business_res ) != "json" || window.business_res == ""){
            window.business_res = '"' + funCon + '"';
        }

    }else if( componentType(funCon) == "fun" ){
        var start = funCon.indexOf(" ");
        var end = funCon.indexOf("(");
        var logic_fun = funCon.substring( start, end ).trim();
        showResult( "<b>" + logic_fun + "</b><br/>");
        logic_fun = funCon + " \n" + logic_fun + "(" + window.business_res + ");";
        try{
            window.business_res = eval( logic_fun );
        }catch (e){
            showErrorResult(logic_fun + "\n" + e);
        }

        if( typeof window.business_res == "object" ){
            window.business_res = JSON.stringify(window.business_res, null, 4);
        }
        showResult( syntaxHighlight(window.business_res) + "\n");
    }
}


function componentType(content) {
    var type = "string";
    if( !content ){
        return type;
    }

    if( isJson( content )){
        type="json";
    }else if( content.indexOf("#")  == 0 ){
        type="flow";
    }else if( content.indexOf("fun") == -1 ){
        type="string";
    }else if( content.length > 0 ){
        type="fun";
    }
    return type;
}

$(document).on("click", "#save-flow-chart", function () {
    if( window.business_group ){
        $("input[name='modal-flow-group']").val( window.business_group );
    }
    if( window.business_name ){
        $("input[name='modal-flow-name']").val( window.business_name );
    }

    $("#flow-chart-modal").modal("show");
});

$(document).on("click", "#save-flow-chart-modal-confirm", function () {
    var data = {};
    data.group = $("input[name='modal-flow-group']").val().trim();
    data.name = $("input[name='modal-flow-name']").val().trim();
    save_flow(data);
    $("#flow-chart-modal").modal("hide");
});

$(document).on("click", "#undo-flow-chart", function () {
    diagram.undoManager.undo();
});

$(document).on("click", "#redo-flow-chart", function () {
    diagram.undoManager.redo();
});

$(document).on("click", "#delete-flow-chart", function () {
    $("#delete-flow-chart-modal").modal("show");
});

$(document).on("click", "#modal-confirm-delete", function () {
    $.get("/delete-flow?group=" + window.business_group + "&name=" + window.business_name,function (res) {
        window.location.reload();
        $("#delete-flow-chart-modal").modal("hide");
        $("li.li-active").trigger("click");
    })
});

$(document).on("click", ".palette-title", function () {
    var divid = $(this).data("target");
    $("#" + divid).slideToggle("slow");
    if( $(this).hasClass("glyphicon-menu-down") ){
        $(this).removeClass("glyphicon-menu-down");
        $(this).addClass("glyphicon-menu-up");
    }else{
        $(this).removeClass("glyphicon-menu-up");
        $(this).addClass("glyphicon-menu-down");
    }
});

function save_flow(data) {
    data.nodeDataArray = diagram.model.nodeDataArray;
    data.linkDataArray = diagram.model.linkDataArray;
    post("/save-flow", data, function (res) {
        console.log(res);
    });
}

function getCodeArr(nodeDataArray, linkDataArray) {
    var rootKey = getRootKey(nodeDataArray, linkDataArray);
    var nodeDataMap = getCodeMap(nodeDataArray);
    var codeArr = getStepCodeArr(linkDataArray, rootKey, nodeDataMap);
    return codeArr;
}
function  getStepCodeArr(linkDataArray, rootKey, nodeDataMap) {
    var codeArr = [];
    codeArr.push( nodeDataMap[ rootKey ] );
    var flag = rootKey;
    var linkArr = linkDataArray;
    while ( true ){
        var i = 0;
        var hasNext = false;
        for(i = 0; i < linkArr.length; i++){
            if( linkArr[i].from == flag ){
                codeArr.push( nodeDataMap[ linkArr[i].to ]);
                flag = linkArr[i].to;
                hasNext = true;
                break;
            }
        }
        if( !hasNext ){
            break;
        }
    }
    return codeArr;
}

function getCodeMap(nodeDataArray) {
    var nodeDataMap = {};
    nodeDataArray.forEach(function (obj) {
        nodeDataMap[ obj.key ] = obj;
    });
    return nodeDataMap;
}

function getRootKey(nodeDataArray) {
    var rootKey = "";
    nodeDataArray.forEach(function (obj) {
        if( obj.category == "Start" ){
            rootKey = obj.key;
            return rootKey;
        };
    });
    var len = nodeDataArray.length;
    if( len == 1 ){
        return nodeDataArray[0].key;
    }
    for(var i = 0; i < len; i++){
        if( !nodeDataArray[i].text ){
            break;
        }
        if( nodeDataArray[i].category != "End" && (componentType(nodeDataArray[i].text) == "string" || componentType(nodeDataArray[i].text) == "json")){
            rootKey = nodeDataArray[i].key;
            return rootKey;
        }
    }
}


function select_node(key) {
    if( diagram ){
        var node = diagram.findNodeForKey( key );
        diagram.select(node);
    }
}
function search_node(content) {
    if( diagram ){
        var regex = new RegExp(content, "i");
        var results = diagram.findNodesByExample({ text: regex });
        if (results.count > 0) diagram.select(results.first());
    }
}

function selectListener(diagram) {
    window.select_Port = null;
    diagram.addDiagramListener("TextEdited", function(e) {
        window.select_Port = e.subject.part;
        set_flow_detail_link();

    });
    diagram.addDiagramListener("ObjectSingleClicked", function(e) {
        window.select_Port = e.subject.part;
        set_flow_detail_link();

    });
    diagram.addDiagramListener("ObjectContextClicked", function(e) {
        window.select_Port = e.subject.part;
        set_flow_detail_link();
    });

    diagram.addDiagramListener("BackgroundSingleClicked", function(e) {
        window.select_Port = null;
    });
    diagram.addDiagramListener("BackgroundDoubleClicked", function(e) {
        window.select_Port = null;
    });
    diagram.addDiagramListener("BackgroundContextClicked", function(e) {
        window.select_Port = null;
    });
}

function set_flow_detail_link() {
    if( window.select_Port == null ){
        $("#flow-detail-link").empty();
        return;
    }
    var con = window.select_Port.Vd.text;
    var href = "";
    if( con.indexOf("#") == 0 ){
        var tmpArr = con.substring(1).split(":");
        href = "business-detail?group=" + tmpArr[0]+ "&name=" + tmpArr[1];
    }else{
        if( window.select_Port.Vd.category.indexOf("custom") == 0 ){
            href = "/business-list?group=" + con;
        }
    }
    if( href != "" ){
        $("#flow-detail-link").data("href", href);
        $("#flow-detail-link").html( '<span class="glyphicon glyphicon-hand-right"></span> ' + con);
    }else{
        $("#flow-detail-link").empty();
    }
}

$(function () {
    $('#flow-chart-link-modal').on('shown.bs.modal', function () {
        var href = $("#flow-detail-link").data("href");
        $("#flow-chart-modal-iframe").attr("src", href);
        console.log(111111);
    });
});


function clear(){
    $("#flow-chart-result").empty();
}

function showErrorResult(msg) {
    showResult( "<span style='color:#ac3314'>" + msg + "</span>" );
}

function showResult(msg) {
    $("#flow-chart-result").append(msg);
}