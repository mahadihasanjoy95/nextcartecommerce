package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequestDto(

        // Nullable for Google-only accounts that are setting a password for the first time.
        // Service validates this conditionally: required only when the user already has a password.
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters")
        String newPassword
) {}
