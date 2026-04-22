package com.help.service.impl;

import com.help.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.base-url}")
    private String baseUrl;

    @Value("${ai.model}")
    private String model;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public String getPageSummary(String pageContext) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("系统未配置 AI API KEY，请联系管理员");
        }

        String url = baseUrl + "/chat/completions";

        // 1. 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey); // 自动添加 Authorization: Bearer xxx

        // 2. 构造 Prompt 提示词（遵循前端文档要求）
        String prompt = "你是一个校园积分互助平台的新手引导助手。用户现在正在访问【" + pageContext + "】页面。请用一小段话（50字左右）友好地向用户概括这个页面的主要功能和可以进行的操作。";

        // 3. 构造请求体参数 (OpenAI 格式)
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        body.put("messages", messages);

        // 4. 发起 HTTP POST 请求
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            // 5. 解析 DeepSeek 返回的结果
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AI 接口调用失败：" + e.getMessage());
        }

        return "抱歉，AI 暂时无法提供页面概括。";
    }
}