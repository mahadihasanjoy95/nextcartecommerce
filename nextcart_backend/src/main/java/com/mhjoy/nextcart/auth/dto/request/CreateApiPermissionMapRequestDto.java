package com.mhjoy.nextcart.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating an API permission mapping.
 *
 * <p>Three mutually exclusive modes — exactly one must be set:
 * <ul>
 *   <li><b>Public</b>: {@code isPublic = true}, {@code permissionCode} is null</li>
 *   <li><b>Authenticated-only</b>: {@code authenticatedOnly = true}, {@code permissionCode} is null</li>
 *   <li><b>Permission-protected</b>: {@code permissionCode} set, both flags false</li>
 * </ul>
 *
 * <p><b>Note on pathPattern:</b> Must exactly match the Ant-style path pattern exposed by Spring MVC
 * (e.g. {@code /api/v1/products/**}). No validation is done against registered routes —
 * an incorrect pattern will silently never match.
 */
public record CreateApiPermissionMapRequestDto(

        @NotBlank(message = "HTTP method is required")
        @Pattern(regexp = "^(GET|POST|PUT|PATCH|DELETE)$",
                message = "HTTP method must be one of: GET, POST, PUT, PATCH, DELETE")
        String httpMethod,

        @NotBlank(message = "Path pattern is required")
        @Size(max = 255, message = "Path pattern must not exceed 255 characters")
        String pathPattern,

        /**
         * Required permission code (e.g. "product:create") for permission-protected routes.
         * Must be null when isPublic or authenticatedOnly is true.
         */
        String permissionCode,

        /**
         * When true, this endpoint requires no JWT — publicly accessible by anyone.
         * Admin can toggle this at runtime. Defaults to false.
         */
        Boolean isPublic,

        /**
         * When true, any valid JWT is sufficient — no specific permission required.
         * Used for endpoints like /auth/logout or /auth/me. Defaults to false.
         */
        Boolean authenticatedOnly,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {}
