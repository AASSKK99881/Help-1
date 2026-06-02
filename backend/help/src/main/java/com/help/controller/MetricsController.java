package com.help.controller;

import com.help.config.MetricsInterceptor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MetricsController {

    private final MetricsInterceptor metricsInterceptor;

    public MetricsController(MetricsInterceptor metricsInterceptor) {
        this.metricsInterceptor = metricsInterceptor;
    }

    @GetMapping("/metrics")
    public Map<String, Object> metrics() {
        return Map.of(
            "totalRequests", metricsInterceptor.getTotalRequests(),
            "errorRequests", metricsInterceptor.getErrorRequests(),
            "averageResponseTimeMs", String.format("%.2f", metricsInterceptor.getAverageResponseTime()),
            "errorRate", String.format("%.2f%%", metricsInterceptor.getErrorRate())
        );
    }
}
