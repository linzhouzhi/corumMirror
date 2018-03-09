package com.lzz.dao.nosql;

import com.lzz.util.XmlUtil;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Created by lzz on 2018/2/22.
 */
@Component
public class XmlDb implements INosql{
    @Override
    public boolean add(String document, String key, String value) {
        XmlUtil xmlUtil = new XmlUtil(document);
        return xmlUtil.add(key, value);
    }

    @Override
    public boolean remove(String document, String key) {
        XmlUtil xmlUtil = new XmlUtil(document);
        return xmlUtil.remove( key );
    }

    @Override
    public String get(String document, String key) {
        XmlUtil xmlUtil = new XmlUtil(document);
        return xmlUtil.get( key );
    }

    @Override
    public Map<String, String> list(String document) {
        XmlUtil xmlUtil = new XmlUtil(document);
        return xmlUtil.getAllMap();
    }

}
