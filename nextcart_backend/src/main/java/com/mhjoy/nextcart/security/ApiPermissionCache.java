package com.mhjoy.nextcart.security;

import java.util.Map;
import java.util.Set;

/**
 * Abstraction for the API permission mapping cache.
 *
 * <p>Currently backed by an in-memory TTL map ({@link InMemoryApiPermissionCache}).
 * When Redis is introduced, swap in a Redis-backed implementation without
 * touching {@link DbAuthorizationManager}.</p>
 *
 * <p>Protected map: {@code "METHOD::/path/pattern" -> "permissionCode"}<br>
 * Public set:      {@code "METHOD::/path/pattern"} — no permission required</p>
 */
public interface ApiPermissionCache {

    /**
     * Returns all active protected API → permission mappings.
     * Key format: {@code "METHOD::pathPattern"}, value: permission code.
     */
    Map<String, String> getAll();

    /**
     * Returns all active public route keys (is_public = true).
     * Key format: {@code "METHOD::pathPattern"} — no auth required for these.
     */
    Set<String> getPublicRoutes();

    /**
     * Returns all active authenticated-only route keys (authenticated_only = true).
     * Key format: {@code "METHOD::pathPattern"} — valid JWT required, no specific permission.
     */
    Set<String> getAuthenticatedOnlyRoutes();

    /**
     * Evicts the cache, forcing a reload on the next call.
     */
    void evict();
}
