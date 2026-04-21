package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating an existing API permission mapping.
 * All fields are optional — only non-null fields are applied.
 *
 * <p>To make a protected route public: set {@code isPublic = true} (permissionCode becomes irrelevant).
 * <p>To revert a public route back to protected: set {@code isPublic = false} and provide {@code permissionCode}.
 */
public record UpdateApiPermissionMapRequestDto(

        /**
         * Change the required permission code. Only applies to permission-protected routes.
         * Must be an existing permission code (e.g. "product:create").
         */
        String permissionCode,

        /**
         * Toggle the active flag. Inactive mappings are excluded from the cache —
         * effectively disabling the guard without deleting the rule.
         */
        Boolean active,

        /**
         * Toggle public access. When true, no JWT is required for this endpoint.
         * When switching from public to protected, also provide permissionCode.
         */
        Boolean isPublic,

        /**
         * Toggle authenticated-only access. When true, any valid JWT is sufficient.
         */
        Boolean authenticatedOnly,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {}
