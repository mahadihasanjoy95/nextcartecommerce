package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePermissionRequestDto(

        @NotBlank(message = "Permission code is required")
        @Pattern(regexp = "^[a-z0-9-]+:[a-z0-9-]+$", message = "Permission code must follow 'module:action' format (e.g. product:create)")
        @Size(max = 100, message = "Permission code must not exceed 100 characters")
        String code,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description,

        @NotBlank(message = "Module is required")
        @Size(max = 50, message = "Module must not exceed 50 characters")
        String module
) {}
