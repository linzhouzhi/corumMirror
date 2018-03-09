package com.lzz.logic;

import com.lzz.dao.base.IQuery;
import com.lzz.model.RedisQueryParam;
import com.lzz.model.Response;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * Created by lzz on 2018/2/22.
 */
@Component
public class RedisLogic {
    @Resource
    IQuery redisCluster;

    public Response query(RedisQueryParam redisQueryParam) throws InterruptedException {
        Thread.sleep(1000);
        Object res = redisCluster.query( redisQueryParam );
        return Response.Obj(0, res);
    }
}
