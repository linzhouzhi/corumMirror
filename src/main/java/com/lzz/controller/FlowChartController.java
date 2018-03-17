package com.lzz.controller;

import com.lzz.logic.FlowChartLogic;
import com.lzz.logic.FrameLogic;
import com.lzz.model.Response;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lzz on 2018/2/19.
 */
@Controller
public class FlowChartController {
    @Resource
    FlowChartLogic logic;
    @Resource
    FrameLogic frameLogic;

    @RequestMapping("/flow-view")
    public String flowView(Model model, @RequestParam String group, @RequestParam String flow_name) {
        Response response = logic.getFlow( group, flow_name );
        model.addAttribute("flow_data", response);
        model.addAttribute("group", group);
        model.addAttribute("business", flow_name);
        model.addAttribute("allFlow", flowAllMap());
        return "flow-view";
    }

    @RequestMapping("/add-flow")
    public String addFlow(Model model, @RequestParam(defaultValue = "") String business) {
        model.addAttribute("allFlow", flowAllMap());
        model.addAttribute("business", null);
        return "add-flow";
    }

    public Map<String, List<String>> flowAllMap(){
        Map<String, List<String>> allMap = new HashMap<>();
        List<String> flows = frameLogic.getBusinessList();
        for( String flow : flows ){
            Response response = logic.getBusinessList( flow );
            allMap.put( flow, (List<String>) response.getRes());
        }
        return allMap;
    }

    @RequestMapping("/business-list")
    public String businessGroup(Model model, @RequestParam(defaultValue = "") String group) {
        Response result = logic.getBusinessList( group );
        model.addAttribute("businessList", result.getRes());
        model.addAttribute("group", group);
        return "business-list";
    }

    @RequestMapping("/group-list")
    @ResponseBody
    public Response groupList(Model model, @RequestParam(defaultValue = "") String group) {
        Response result = logic.getBusinessList( group );
        return result;
    }

    @RequestMapping("/business-detail")
    public String business(Model model, @RequestParam(defaultValue = "") String group, @RequestParam(defaultValue = "") String name) {
        Response response = Response.Fail();
        if(!StringUtils.isEmpty( group ) ) {
            response = logic.getFlow( group, name );
        }
        model.addAttribute("business", response);
        model.addAttribute("businessGroup", group);
        model.addAttribute("businessName", name);
        model.addAttribute("allFlow", flowAllMap());
        return "business-detail";
    }

    @RequestMapping("/flow-detail")
    @ResponseBody
    public Response flowDetail(Model model, @RequestParam String group, @RequestParam String name) {
        Response response = Response.Fail();
        response = logic.getFlow( group, name );
        return response;
    }

    @RequestMapping("/save-flow")
    @ResponseBody
    public Response saveFlow(@RequestBody JSONObject jsonObj){
        return logic.saveFlow(jsonObj);
    }

    @RequestMapping("/delete-flow")
    @ResponseBody
    public Response deleteFlow(@RequestParam String name,@RequestParam String group){
        return logic.deleteFlow(group, name);
    }

    @RequestMapping("/get-flow")
    @ResponseBody
    public Response getFlow(@RequestParam String name,@RequestParam String group){
        return logic.getFlow( group, name );
    }

    @RequestMapping("/get-business-flow")
    @ResponseBody
    public Response getBusinessFlow(@RequestParam String group){
        return logic.getBusinessList( group );
    }


}
