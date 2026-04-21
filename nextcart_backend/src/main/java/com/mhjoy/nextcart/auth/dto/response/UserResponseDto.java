package com.mhjoy.nextcart.auth.dto.response;

import com.mhjoy.nextcart.auth.enums.UserType;

import java.time.Instant;
import java.util.Set;

public record UserResponseDto(
        Long id,
        String email,
        String phone,
        String firstName,
        String lastName,
        UserType userType,
        boolean enabled,
        boolean emailVerified,
        boolean phoneVerified,
        Set<String> roles,
        Instant createdAt,
        String profilePictureUrl,
        /** true when the user has a BCrypt password hash set (false for Google-only accounts) */
        boolean hasPassword
) {}
