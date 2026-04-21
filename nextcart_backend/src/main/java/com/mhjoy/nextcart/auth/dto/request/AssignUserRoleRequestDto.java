package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AssignUserRoleRequestDto(

        @NotBlank(message = "Role is required")
        @Pattern(
                regexp = "^[A-Z][A-Z0-9_]*$",
                message = "Role name must be uppercase and may contain letters, numbers, and underscores only"
        )
        @Size(max = 50, message = "Role name must not exceed 50 characters")
        String role
) {}
