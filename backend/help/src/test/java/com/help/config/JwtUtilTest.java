package com.help.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil(
            "help-platform-test-secret-key-very-long!!", 3600000);

    @Test
    void generateToken_ReturnsNonEmptyString() {
        String token = jwtUtil.generateToken(1L, "testuser", 0);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void getUserId_ReturnsCorrectId() {
        String token = jwtUtil.generateToken(42L, "user42", 0);
        assertEquals(42L, jwtUtil.getUserId(token));
    }

    @Test
    void getRole_ReturnsCorrectRole() {
        String token = jwtUtil.generateToken(1L, "admin", 1);
        assertEquals(1, jwtUtil.getRole(token));
    }

    @Test
    void isTokenExpired_ValidToken_ReturnsFalse() {
        String token = jwtUtil.generateToken(1L, "test", 0);
        assertFalse(jwtUtil.isTokenExpired(token));
    }

    @Test
    void isTokenExpired_InvalidToken_ReturnsTrue() {
        assertTrue(jwtUtil.isTokenExpired("invalid.token.here"));
        assertTrue(jwtUtil.isTokenExpired(""));
        assertTrue(jwtUtil.isTokenExpired(null));
    }

    @Test
    void parseToken_ReturnsClaims() {
        String token = jwtUtil.generateToken(7L, "user7", 1);
        var claims = jwtUtil.parseToken(token);
        assertEquals("7", claims.getSubject());
        assertEquals(1, claims.get("role"));
    }
}
