package com.lzz.dao.nosql;

import java.util.Map;

/**
 * Created by lzz on 2018/2/22.
 */
public interface INosql {
    boolean add(String document, String key, String value);
    boolean remove(String document, String key);
    String get(String document, String key);
    Map<String, String> list(String document);
}
