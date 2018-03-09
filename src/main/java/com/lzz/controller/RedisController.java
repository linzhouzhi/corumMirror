package com.lzz.controller;

import com.lzz.logic.RedisLogic;
import com.lzz.model.RedisQueryParam;
import com.lzz.model.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created by lzz on 2018/2/12.
 */
@Controller
@RequestMapping("/redis")
public class RedisController {
    @Resource
    RedisLogic logic;

    @RequestMapping("/query")
    @ResponseBody
    public Response query(@RequestBody RedisQueryParam redisQueryParam) throws InterruptedException {
        return logic.query(redisQueryParam);
    }
}
