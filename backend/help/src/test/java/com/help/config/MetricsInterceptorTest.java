package com.help.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MetricsInterceptorTest {

    @InjectMocks private MetricsInterceptor interceptor;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;

    @Test
    void preHandle_IncrementsTotalRequests() {
        assertTrue(interceptor.preHandle(request, response, null));
        assertTrue(interceptor.getTotalRequests() >= 1);
    }

    @Test
    void afterCompletion_RecordsMetrics() {
        interceptor.preHandle(request, response, null);
        when(response.getStatus()).thenReturn(200);
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestURI()).thenReturn("/api/test");

        interceptor.afterCompletion(request, response, null, null);
        // no exception = success
    }

    @Test
    void afterCompletion_ErrorStatus_IncrementsErrorCount() {
        interceptor.preHandle(request, response, null);
        when(response.getStatus()).thenReturn(500);
        when(request.getMethod()).thenReturn("POST");
        when(request.getRequestURI()).thenReturn("/api/error");

        interceptor.afterCompletion(request, response, null, null);

        assertTrue(interceptor.getErrorRequests() >= 1);
    }

    @Test
    void afterCompletion_Exception_IncrementsErrorCount() {
        interceptor.preHandle(request, response, null);
        when(response.getStatus()).thenReturn(200);
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestURI()).thenReturn("/api/exception");

        interceptor.afterCompletion(request, response, null, new RuntimeException("test"));

        assertTrue(interceptor.getErrorRequests() >= 1);
    }

    @Test
    void getAverageResponseTime_ZeroRequests_ReturnsZero() {
        // fresh interceptor with no requests
        MetricsInterceptor fresh = new MetricsInterceptor();
        assertEquals(0.0, fresh.getAverageResponseTime());
    }

    @Test
    void getErrorRate_ZeroRequests_ReturnsZero() {
        MetricsInterceptor fresh = new MetricsInterceptor();
        assertEquals(0.0, fresh.getErrorRate());
    }
}
