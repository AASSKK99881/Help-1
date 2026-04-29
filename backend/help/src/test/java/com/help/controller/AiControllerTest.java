package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.help.dto.AiSummaryReq;
import com.help.service.AiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AiController.class)
public class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiService aiService;

    @Autowired
    private ObjectMapper objectMapper;

    // 5. API测试: AI摘要成功
    @Test
    void getSummary_Success() throws Exception {
        AiSummaryReq req = new AiSummaryReq();
        req.setPageContext("任务大厅");

        when(aiService.getPageSummary("任务大厅")).thenReturn("这里是任务大厅模块");

        mockMvc.perform(post("/api/ai/summary")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.summary").value("这里是任务大厅模块"));
    }

    // 6. API测试: 参数校验失败 (上下文为空)
    @Test
    void getSummary_EmptyContext() throws Exception {
        AiSummaryReq req = new AiSummaryReq();
        req.setPageContext("   "); // 空白字符串

        mockMvc.perform(post("/api/ai/summary")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk()) // 返回200，但业务状态码是400
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("页面上下文不能为空"));
    }
}