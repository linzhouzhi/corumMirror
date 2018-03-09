/**
 * Created by lzz on 2018/2/12.
 * 命令行有组件函数的提示  比如 hbase_ kafka_
 */

var logic_component = '<div class="business-component" data-type="logic"><textarea data-isvalue="true" class="form-control" rows="3"></textarea></div>';
$(".business-type").click(function () {
    var type = $(this).data("type");
    switch(type){
        case "redis":
            break;
        case "logic":
            $("#business-content").append( logic_component );
            break;
        case "run":
            run_business();
            break;
    }
});

window.business_res = "";
function run_business() {
    $("#business-content").children().each(function(){
        var type = $(this).data("type");
        switch (type){
            case "input":
                window.business_res = $(this).children("textarea[data-isvalue='true']").val();
                break;
            case "logic":
                var logic_content = $(this).children("textarea[data-isvalue='true']").val();
                if( logic_content && logic_content.length > 0 ){
                    var start = logic_content.indexOf(" ");
                    var end = logic_content.indexOf("(");
                    var logic_fun = logic_content.substring( start, end ).trim();
                    logic_fun = logic_content + " " + logic_fun + "(" + window.business_res + ");";
                    window.business_res = eval( logic_fun );
                }
                break;
        }
        $("#business-result").html( syntaxHighlight(window.business_res) );
    });
}
