package com.help.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class MetricsInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(MetricsInterceptor.class);

    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong errorRequests = new AtomicLong(0);
    private final AtomicLong totalResponseTime = new AtomicLong(0);

    private final ThreadLocal<Long> requestStartTime = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        requestStartTime.set(System.currentTimeMillis());
        totalRequests.incrementAndGet();
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        long duration = System.currentTimeMillis() - requestStartTime.get();
        requestStartTime.remove();
        totalResponseTime.addAndGet(duration);

        int status = response.getStatus();
        if (status >= 400 || ex != null) {
            errorRequests.incrementAndGet();
        }

        logger.info("method={} uri={} status={} durationMs={}",
                request.getMethod(), request.getRequestURI(), status, duration);
    }

    public long getTotalRequests() {
        return totalRequests.get();
    }

    public long getErrorRequests() {
        return errorRequests.get();
    }

    public double getAverageResponseTime() {
        long total = totalRequests.get();
        return total == 0 ? 0 : (double) totalResponseTime.get() / total;
    }

    public double getErrorRate() {
        long total = totalRequests.get();
        return total == 0 ? 0 : (double) errorRequests.get() / total * 100;
    }
}
