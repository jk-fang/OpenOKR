package org.openokr.manage.web;

import com.zzheng.framework.adapter.vo.ResponseResult;
import com.zzheng.framework.mybatis.dao.pojo.Page;
import org.openokr.application.framework.annotation.JsonPathParam;
import org.openokr.application.web.BaseController;
import org.openokr.manage.service.IOkrMessageService;
import org.openokr.manage.vo.MessagesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * OKR消息管理
 *
 * @author hjh
 */
@Controller
@RequestMapping("/manage/okrMessage")
public class OkrMessageController extends BaseController {

    @Autowired
    private IOkrMessageService okrMessageService;

    @GetMapping("/index.htm")
    public String index() {
        return "manage/okrMessage";
    }

    /**
     * 获取OKR消息提醒
     * @return
     */
    @RequestMapping(value = "/getAllMessage.json")
    @ResponseBody
    public Page getOkrMessage(@JsonPathParam("$.pageInfo") Page page) {
        return okrMessageService.getMessageByPage(page, getCurrentUserId());
    }

    /**
     * 更新OKR消息
     */
    @PostMapping(value = "/update.json")
    @ResponseBody
    public ResponseResult update(@JsonPathParam("$.messageVO") MessagesVO messagesVO) {
        return okrMessageService.update(messagesVO, getCurrentUserId());
    }
}