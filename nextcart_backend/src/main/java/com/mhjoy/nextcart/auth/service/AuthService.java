package com.mhjoy.nextcart.auth.service;

import com.mhjoy.nextcart.auth.dto.request.ChangePasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CustomerRegisterRequestDto;
import com.mhjoy.nextcart.auth.dto.request.ForgotPasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.LoginRequestDto;
import com.mhjoy.nextcart.auth.dto.request.RefreshTokenRequestDto;
import com.mhjoy.nextcart.auth.dto.request.ResetPasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.UpdateProfileRequestDto;
import com.mhjoy.nextcart.auth.dto.response.ForgotPasswordResponseDto;
import com.mhjoy.nextcart.auth.dto.response.TokenResponseDto;
import com.mhjoy.nextcart.auth.dto.response.UserResponseDto;

public interface AuthService {

    UserResponseDto register(CustomerRegisterRequestDto requestDto);

    TokenResponseDto login(LoginRequestDto requestDto);

    TokenResponseDto refresh(RefreshTokenRequestDto requestDto);

    void logout(String refreshToken);

    UserResponseDto me(Long userId);

    UserResponseDto updateMe(Long userId, UpdateProfileRequestDto requestDto);

    void changePassword(Long userId, ChangePasswordRequestDto requestDto);

    /**
     * Handles forgot-password requests.
     *
     * <ul>
     *   <li>Normal user → sends reset-link email, returns {@code EMAIL_SENT}</li>
     *   <li>Google-only user → sends social-login-reminder email, returns {@code SOCIAL_ACCOUNT}</li>
     *   <li>Unknown email → returns {@code EMAIL_SENT} (no email sent; prevents enumeration)</li>
     * </ul>
     */
    ForgotPasswordResponseDto forgotPassword(ForgotPasswordRequestDto requestDto);

    /**
     * Validates the reset token, updates the password, and invalidates the token.
     */
    void resetPassword(ResetPasswordRequestDto requestDto);

    /**
     * Saves a new S3 profile picture key for the user, returning the old key so the
     * caller can delete the previous file from S3 if needed.
     *
     * @return the old profilePictureKey (may be null if none existed)
     */
    String updateProfilePictureKey(Long userId, String newKey);
}
