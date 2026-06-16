package com.help.config;

import com.help.common.Result;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleRuntimeException_ReturnsErrorResult() {
        Result<?> r = handler.handleRuntimeException(new RuntimeException("业务异常"));
        assertEquals(400, r.getCode());
        assertEquals("业务异常", r.getMessage());
    }

    @Test
    void handleException_ReturnsGenericError() {
        Result<?> r = handler.handleException(new Exception("内部错误"));
        assertEquals(400, r.getCode());
        assertEquals("服务器内部错误", r.getMessage());
    }
}
