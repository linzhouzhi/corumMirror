package com.lzz.controller;

import com.lzz.logic.FrameLogic;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by lzz on 2018/1/21.
 */
@org.springframework.stereotype.Controller
public class FrameController {
    @Resource
    FrameLogic logic;

    @RequestMapping("/index")
    public String litterCase(Model model) {
        List<String> businessList = logic.getBusinessList();
        model.addAttribute("businessList", businessList);
        return "index";
    }

    @RequestMapping("/flow-list")
    @ResponseBody
    public List<String> flowList(Model model) {
        List<String> flows = logic.getBusinessList();
        return flows;
    }

    @RequestMapping("/welcome")
    public String welcome(Model model) {
        return "default/welcome";
    }

}
