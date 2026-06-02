package com.help.service;

import java.util.Map;

public interface AiService {
    /**
     * 审核任务内容。返回 {passed: boolean, reason: "..."}
     */
    Map<String, Object> reviewTaskContent(String title, String description, java.util.List<String> keywords);
}
