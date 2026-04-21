package com.mhjoy.nextcart.auth.dto.response;

import java.time.Instant;

public record PermissionResponseDto(
        Long id,
        String code,
        String description,
        String module,
        Instant createdAt
) {}
