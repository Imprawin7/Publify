package com.publify.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long accessTokenExpiryMs;
    private final long refreshTokenExpiryMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiry-ms}") long accessTokenExpiryMs,
            @Value("${app.jwt.refresh-token-expiry-ms}") long refreshTokenExpiryMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiryMs = accessTokenExpiryMs;
        this.refreshTokenExpiryMs = refreshTokenExpiryMs;
    }

    public String generateAccessToken(String email, String role) {
        return buildToken(
                email,
                role,
                null,
                "access",
                accessTokenExpiryMs
        );
    }

    public String generateAccessToken(
            String email,
            String role,
            Long workspaceId,
            String workspaceRole
    ) {
        return buildToken(
                email,
                role,
                workspaceId,
                workspaceRole,
                "access",
                accessTokenExpiryMs
        );
    }

    public String generateRefreshToken(String email, String role) {
        return buildToken(
                email,
                role,
                null,
                "refresh",
                refreshTokenExpiryMs
        );
    }

    public String generateRefreshToken(
            String email,
            String role,
            Long workspaceId,
            String workspaceRole
    ) {
        return buildToken(
                email,
                role,
                workspaceId,
                workspaceRole,
                "refresh",
                refreshTokenExpiryMs
        );
    }

    private String buildToken(
            String email,
            String role,
            Long workspaceId,
            String type,
            long expiryMs
    ) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);

        JwtBuilder builder = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("type", type)
                .setIssuedAt(now)
                .setExpiration(expiry);

        if (workspaceId != null) {
            builder.claim("workspaceId", workspaceId);
        }

        return builder
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String buildToken(
            String email,
            String role,
            Long workspaceId,
            String workspaceRole,
            String type,
            long expiryMs
    ) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);

        JwtBuilder builder = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("type", type)
                .setIssuedAt(now)
                .setExpiration(expiry);

        if (workspaceId != null) {
            builder.claim("workspaceId", workspaceId);
        }

        if (workspaceRole != null && !workspaceRole.isBlank()) {
            builder.claim("workspaceRole", workspaceRole);
        }

        return builder
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public String extractWorkspaceRole(String token) {
        return parseClaims(token).get("workspaceRole", String.class);
    }

    public Long extractWorkspaceId(String token) {
        Object value = parseClaims(token).get("workspaceId");

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(value.toString());
    }

    public String extractType(String token) {
        return parseClaims(token).get("type", String.class);
    }
}