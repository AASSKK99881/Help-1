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
public class AdminInterceptorTest {

    @Mock private JwtUtil jwtUtil;
    @InjectMocks private AdminInterceptor interceptor;

    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;

    @Test
    void preHandle_OptionsRequest_ReturnsTrue() throws Exception {
        when(request.getMethod()).thenReturn("OPTIONS");

        assertTrue(interceptor.preHandle(request, response, null));
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
    void preHandle_InvalidAuthFormat_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Basic abc");
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }

    @Test
    void preHandle_AdminRole_ReturnsTrue() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer admin-token");
        when(jwtUtil.getRole("admin-token")).thenReturn(1);
        when(jwtUtil.getUserId("admin-token")).thenReturn(1L);

        assertTrue(interceptor.preHandle(request, response, null));
        verify(request).setAttribute("userId", 1L);
        verify(request).setAttribute("userRole", 1);
    }

    @Test
    void preHandle_NotAdmin_Returns403() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer student-token");
        when(jwtUtil.getRole("student-token")).thenReturn(0);
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(403);
    }

    @Test
    void preHandle_NullRole_Returns403() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer token");
        when(jwtUtil.getRole("token")).thenReturn(null);
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(403);
    }

    @Test
    void preHandle_TokenParseException_Returns401() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getHeader("Authorization")).thenReturn("Bearer bad");
        when(jwtUtil.getRole("bad")).thenThrow(new RuntimeException("parse error"));
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        assertFalse(interceptor.preHandle(request, response, null));
        verify(response).setStatus(401);
    }
}
