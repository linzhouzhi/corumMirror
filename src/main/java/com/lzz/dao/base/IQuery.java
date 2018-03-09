package com.lzz.dao.base;

/**
 * Created by lzz on 2018/2/22.
 */
public interface IQuery<T> {
    Object query(T q);
}
