package com.lzz.dao.redis.imp;

import com.lzz.dao.base.IQuery;
import com.lzz.dao.redis.IRedisDao;
import com.lzz.model.RedisQueryParam;
import org.springframework.stereotype.Component;

/**
 * Created by lzz on 2018/2/22.
 */
@Component
public class RedisCluster  implements IRedisDao, IQuery<RedisQueryParam>{

    @Override
    public Object query(RedisQueryParam q) {
        return q;
    }
}
