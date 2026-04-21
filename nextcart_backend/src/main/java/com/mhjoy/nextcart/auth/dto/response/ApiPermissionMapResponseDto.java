package com.mhjoy.nextcart.auth.dto.response;

import java.time.Instant;

public record ApiPermissionMapResponseDto(
        Long id,
        String httpMethod,
        String pathPattern,
        PermissionResponseDto permission,   // null for public / authenticated-only routes
        boolean active,
        boolean isPublic,
        boolean authenticatedOnly,
        String description,
        Instant createdAt
) {}
