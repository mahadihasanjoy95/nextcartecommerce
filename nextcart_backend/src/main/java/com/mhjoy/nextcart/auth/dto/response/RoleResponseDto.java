package com.mhjoy.nextcart.auth.dto.response;

import java.util.Set;

public record RoleResponseDto(
        Long id,
        String name,
        String description,
        Set<PermissionResponseDto> permissions
) {}
