package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record AssignRolePermissionsRequestDto(

        @NotNull(message = "Permission IDs must not be null")
        Set<Long> permissionIds
) {}
