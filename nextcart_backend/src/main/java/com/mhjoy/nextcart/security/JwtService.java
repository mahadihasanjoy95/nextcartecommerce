package com.mhjoy.nextcart.security;

import com.mhjoy.nextcart.auth.enums.UserType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Handles JWT generation and parsing for access and refresh tokens.
 *
 * <p>Access tokens carry userId, email, userType and expire in 1 hour.
 * Refresh tokens carry only userId and email and expire in 30 days.
 * A "type" claim distinguishes the two to prevent refresh tokens
 * from being used as access tokens.</p>
 */
@Service
@Slf4j
public class JwtService {

    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_USER_TYPE = "userType";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";

    private final SecretKey signingKey;
    private final long accessTokenExpirySeconds;
    private final long refreshTokenExpirySeconds;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiry-seconds}") long accessTokenExpirySeconds,
            @Value("${jwt.refresh-token-expiry-seconds}") long refreshTokenExpirySeconds
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirySeconds = accessTokenExpirySeconds;
        this.refreshTokenExpirySeconds = refreshTokenExpirySeconds;
    }

    public String generateAccessToken(Long userId, String email, UserType userType) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_EMAIL, email)
                .claim(CLAIM_USER_TYPE, userType.name())
                .claim(CLAIM_TYPE, TYPE_ACCESS)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirySeconds * 1000L))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(Long userId, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_EMAIL, email)
                .claim(CLAIM_TYPE, TYPE_REFRESH)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpirySeconds * 1000L))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Parses and validates a token. Returns claims on success.
     * Throws {@link JwtException} on invalid signature, malformed token, or expiry.
     */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isAccessToken(Claims claims) {
        return TYPE_ACCESS.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public boolean isRefreshToken(Claims claims) {
        return TYPE_REFRESH.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public Long extractUserId(Claims claims) {
        return Long.valueOf(claims.getSubject());
    }

    public String extractEmail(Claims claims) {
        return claims.get(CLAIM_EMAIL, String.class);
    }

    public UserType extractUserType(Claims claims) {
        String raw = claims.get(CLAIM_USER_TYPE, String.class);
        return raw != null ? UserType.valueOf(raw) : null;
    }

    public long getRefreshTokenExpirySeconds() {
        return refreshTokenExpirySeconds;
    }
}
