package com.lzz.logic;

import com.lzz.model.Common;
import com.lzz.util.FileUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by lzz on 2018/1/21.
 */
@Component
public class FrameLogic {

    public List<String> getBusinessList() {
        List<String> pathList = FileUtil.getDirFiles( Common.XML_DB_PATH );
        List<String> businessList = new ArrayList<>();
        for(int i = 0; i < pathList.size(); i++){
            String tmp = pathList.get( i );
            if( tmp.indexOf("flow-") < 0){
                continue;
            }
            tmp = StringUtils.substringBefore(tmp, ".");
            tmp = StringUtils.substringAfter(tmp, "-");
            businessList.add( tmp );
        }
        return businessList;
    }
}
