package com.help.service;

import com.help.entity.SensitiveWord;
import com.help.mapper.SensitiveWordMapper;
import com.help.service.impl.AiServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AiServiceImplTest {

    @Mock private SensitiveWordMapper sensitiveWordMapper;
    @Mock private org.springframework.web.client.RestTemplate restTemplate;
    @InjectMocks private AiServiceImpl aiService;

    @Test
    void reviewTaskContent_NoApiKey_DefaultsToPass() {
        ReflectionTestUtils.setField(aiService, "apiKey", "");

        Map<String, Object> result = aiService.reviewTaskContent("测试标题", "测试描述", null);

        assertTrue((boolean) result.get("passed"));
        assertEquals("AI未配置，默认通过", result.get("reason"));
    }

    @Test
    void reviewTaskContent_NullApiKey_DefaultsToPass() {
        ReflectionTestUtils.setField(aiService, "apiKey", null);

        Map<String, Object> result = aiService.reviewTaskContent("标题", "描述", null);

        assertTrue((boolean) result.get("passed"));
    }
}
