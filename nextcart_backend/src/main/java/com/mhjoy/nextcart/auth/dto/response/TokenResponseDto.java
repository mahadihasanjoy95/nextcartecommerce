package com.mhjoy.nextcart.auth.dto.response;

public record TokenResponseDto(
        String accessToken,
        String refreshToken,
        long expiresIn,
        String tokenType
) {
    public static TokenResponseDto of(String accessToken, String refreshToken, long expiresInSeconds) {
        return new TokenResponseDto(accessToken, refreshToken, expiresInSeconds, "Bearer");
    }
}
