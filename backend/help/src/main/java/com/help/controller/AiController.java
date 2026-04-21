package com.help.controller;

import com.help.common.Result;
import com.help.dto.AiSummaryReq;
import com.help.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai") // 增加统一前缀
@CrossOrigin
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/summary")
    public Result<Map<String, String>> getSummary(@RequestBody AiSummaryReq req) {
        try {
            // 校验前端参数
            if (req.getPageContext() == null || req.getPageContext().trim().isEmpty()) {
                return Result.error("页面上下文不能为空");
            }

            // 获取 AI 返回的内容
            String summaryText = aiService.getPageSummary(req.getPageContext());

            // 包装成前端要求的格式返回 {"summary": "..."}
            Map<String, String> data = new HashMap<>();
            data.put("summary", summaryText);

            return Result.success(data);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}