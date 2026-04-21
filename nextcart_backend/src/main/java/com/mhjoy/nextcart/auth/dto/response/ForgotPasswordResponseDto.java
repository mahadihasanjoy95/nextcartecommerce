package com.mhjoy.nextcart.auth.dto.response;

/**
 * Response DTO for the forgot-password endpoint.
 *
 * <p>{@code type} tells the frontend how to react:
 * <ul>
 *   <li>{@code EMAIL_SENT}     — a reset link was emailed; show generic "check your inbox" message</li>
 *   <li>{@code SOCIAL_ACCOUNT} — the account was created via Google; show the Google sign-in button</li>
 * </ul>
 */
public record ForgotPasswordResponseDto(String type, String message) {

    public static ForgotPasswordResponseDto emailSent() {
        return new ForgotPasswordResponseDto(
                "EMAIL_SENT",
                "If an account exists for that email, a reset link has been sent."
        );
    }

    public static ForgotPasswordResponseDto socialAccount() {
        return new ForgotPasswordResponseDto(
                "SOCIAL_ACCOUNT",
                "This account uses Google sign-in. Please sign in with Google."
        );
    }
}
