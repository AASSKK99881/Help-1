package com.help.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ResultTest {

    @Test
    void success_ReturnsCode0() {
        Result<String> r = Result.success("hello");
        assertEquals(0, r.getCode());
        assertEquals("success", r.getMessage());
        assertEquals("hello", r.getData());
    }

    @Test
    void error_ReturnsCode400() {
        Result<String> r = Result.error("出错了");
        assertEquals(400, r.getCode());
        assertEquals("出错了", r.getMessage());
        assertNull(r.getData());
    }

    @Test
    void testGettersAndSetters() {
        Result<Integer> r = new Result<>();
        r.setCode(200);
        r.setMessage("ok");
        r.setData(42);

        assertEquals(200, r.getCode());
        assertEquals("ok", r.getMessage());
        assertEquals(42, r.getData());
    }
}
