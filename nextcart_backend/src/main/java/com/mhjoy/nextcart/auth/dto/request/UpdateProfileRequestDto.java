package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequestDto(

        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @Size(max = 20, message = "Phone must not exceed 20 characters")
        String phone
) {}
