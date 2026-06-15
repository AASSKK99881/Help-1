package com.help.service.impl;

import com.help.mapper.SensitiveWordMapper;
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
import java.util.stream.Collectors;

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

    @Autowired
    private SensitiveWordMapper sensitiveWordMapper;

    @Override
    public Map<String, Object> reviewTaskContent(String title, String description, List<String> extraKeywords) {
        Map<String, Object> result = new HashMap<>();

        if (apiKey == null || apiKey.isEmpty()) {
            result.put("passed", true);
            result.put("reason", "AI未配置，默认通过");
            return result;
        }

        // 从数据库读取敏感词
        List<String> dbKeywords = sensitiveWordMapper.selectList(null)
                .stream().map(sw -> sw.getWord()).collect(Collectors.toList());
        List<String> allKeywords = new ArrayList<>(dbKeywords);
        if (extraKeywords != null) allKeywords.addAll(extraKeywords);

        String keywordList = allKeywords.isEmpty() ? "无" : String.join("、", allKeywords);

        String prompt = "你是校园积分互助平台的内容审核员。请审核以下任务是否合规。\n\n"
                + "违禁词库：" + keywordList + "\n\n"
                + "任务标题：" + title + "\n"
                + "任务描述：" + description + "\n\n"
                + "审核标准：\n"
                + "1. 内容不得包含违禁词\n"
                + "2. 任务不得涉及违法、作弊、代考等行为\n"
                + "3. 描述需真实合理\n\n"
                + "只回复 PASS 或 REJECT:具体原因（一行，简洁）";

        String url = baseUrl + "/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);
        body.put("messages", messages);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = ((String) message.get("content")).trim();

                    if (content.startsWith("PASS")) {
                        result.put("passed", true);
                        result.put("reason", "AI审核通过");
                    } else {
                        String reason = content.startsWith("REJECT:") ? content.substring(7).trim() : content;
                        result.put("passed", false);
                        result.put("reason", reason);
                    }
                    return result;
                }
            }
        } catch (Exception e) {
            result.put("passed", false);
            result.put("reason", "AI服务异常，转人工审核");
            return result;
        }

        result.put("passed", false);
        result.put("reason", "AI未返回有效结果，转人工审核");
        return result;
    }
}
