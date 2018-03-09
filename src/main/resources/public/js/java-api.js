/**
 * Created by lzz on 2018/2/22.
 */

function redis_query(param){
    show_loading();
    var result = "";
    post("/redis/query", param, function(respone){
        result =  respone.res;
    });
    hide_loading();
    return result;
}
