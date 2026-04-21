package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAdminRequestDto(

        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid email address")
        @Size(max = 255, message = "Email must not exceed 255 characters")
        String email,

        /**
         * Role name to assign on creation. Defaults to {@code "ADMIN"} when null or blank.
         * SUPER_ADMIN and CUSTOMER are reserved and cannot be assigned here.
         */
        String role
) {
    /** Returns the effective role — falls back to ADMIN when caller omits the field. */
    public String effectiveRole() {
        return (role != null && !role.isBlank()) ? role : "ADMIN";
    }
}
