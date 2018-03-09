package com.lzz.logic;

import com.lzz.dao.nosql.INosql;
import com.lzz.model.Response;
import com.lzz.util.XmlUtil;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by lzz on 2018/2/20.
 */
@Component
public class FlowChartLogic {
    @Resource
    INosql xmlDb;

    public Response saveFlow(JSONObject jsonObj) {
        try {
            String name = jsonObj.getString("name");
            boolean res = xmlDb.add( XmlUtil.getFormatName(jsonObj.getString("group")), name, jsonObj.toString() );
            return  res ? Response.OK() : Response.Fail();
        }catch (Exception ignore){
            return Response.Fail();
        }

    }

    public Response getFlow(String group, String name){
        try {
            String jsonString = xmlDb.get( XmlUtil.getFormatName(group), name);
            return Response.Obj(0, jsonString);
        }catch (Exception ignore){
            return Response.Fail();
        }

    }

    public Response getBusinessList(String group){
        try {
            List<String> keyList = new ArrayList();
            Map<String, String> allMap = xmlDb.list( XmlUtil.getFormatName(group) );
            for(Map.Entry<String, String> element : allMap.entrySet()){
                keyList.add( element.getKey() );
            }
            return Response.Obj(0, keyList);
        }catch (Exception ignore){
            return Response.Fail();
        }
    }

    public Response deleteFlow(String group, String name) {
        try {
            String fileName =  XmlUtil.getFormatName(group);
            boolean res = xmlDb.remove( fileName, name);
            if( res ){
                Map<String, String> allMap = xmlDb.list(fileName);
                if( allMap.isEmpty() ){
                    res = XmlUtil.deleteFile( XmlUtil.getFile(fileName) );
                }
            }
            return res ? Response.OK() : Response.Fail();
        }catch (Exception ignore){
            return Response.Fail();
        }
    }
}
