package com.help.service;

import com.help.service.impl.AiServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AiServiceImpl aiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(aiService, "apiKey", "test-key");
        ReflectionTestUtils.setField(aiService, "baseUrl", "https://test.api");
        ReflectionTestUtils.setField(aiService, "model", "test-model");
    }

    // 6. 测试AI总结 - 成功响应
    @Test
    void getPageSummary_Success() {
        Map<String, Object> mockMessage = new HashMap<>();
        mockMessage.put("content", "这是一个测试页面的AI总结。");

        Map<String, Object> mockChoice = new HashMap<>();
        mockChoice.put("message", mockMessage);

        Map<String, Object> mockResponseMap = new HashMap<>();
        mockResponseMap.put("choices", Arrays.asList(mockChoice));

        ResponseEntity<Map> mockEntity = ResponseEntity.ok(mockResponseMap);

        when(restTemplate.postForEntity(eq("https://test.api/chat/completions"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(mockEntity);

        String result = aiService.getPageSummary("首页");
        assertEquals("这是一个测试页面的AI总结。", result);
    }

    // 7. 测试AI总结 - 异常情况（未配置API Key）
    @Test
    void getPageSummary_MissingApiKey() {
        ReflectionTestUtils.setField(aiService, "apiKey", "");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            aiService.getPageSummary("首页");
        });
        assertEquals("系统未配置 AI API KEY，请联系管理员", exception.getMessage());
    }

    // 8. 测试AI总结 - 接口异常
    @Test
    void getPageSummary_ApiException() {
        when(restTemplate.postForEntity(any(String.class), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RuntimeException("Network Error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            aiService.getPageSummary("首页");
        });
        assertTrue(exception.getMessage().contains("AI 接口调用失败"));
    }
}