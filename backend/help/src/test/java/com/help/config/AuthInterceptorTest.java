package com.help.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthInterceptorTest {

    @Mock private JwtUtil jwtUtil;
    @InjectMocks private AuthInterceptor interceptor;

    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;

    @Test
    void preHandle_OptionsRequest_ReturnsTrue() throws Exception {
        when(request.getMethod()).thenReturn("OPTIONS");

        assertTrue(interceptor.preHandle(request, response, null));
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    void preHandle_MissingAuthHeader_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn(null);
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }

    @Test
    void preHandle_InvalidAuthHeaderFormat_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Basic abc123");
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }

    @Test
    void preHandle_ExpiredToken_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer expired-token");
        when(jwtUtil.isTokenExpired("expired-token")).thenReturn(true);
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }

    @Test
    void preHandle_ValidToken_ReturnsTrue() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer valid-token");
        when(jwtUtil.isTokenExpired("valid-token")).thenReturn(false);
        when(jwtUtil.getUserId("valid-token")).thenReturn(1L);
        when(jwtUtil.getRole("valid-token")).thenReturn(0);

        assertTrue(interceptor.preHandle(request, response, null));
        verify(request).setAttribute("userId", 1L);
        verify(request).setAttribute("userRole", 0);
    }

    @Test
    void preHandle_TokenParseException_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer bad-token");
        when(jwtUtil.isTokenExpired("bad-token")).thenThrow(new RuntimeException("parse error"));
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }
}
