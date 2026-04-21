package com.mhjoy.nextcart.security;

import com.mhjoy.nextcart.auth.entity.ApiPermissionMap;
import com.mhjoy.nextcart.auth.repository.ApiPermissionMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * In-memory implementation of {@link ApiPermissionCache}.
 *
 * <p><b>Invalidation-on-write strategy</b> — NOT TTL polling:
 * <ul>
 *   <li>Cache is loaded lazily on the first incoming request after startup.</li>
 *   <li>Cache is reloaded <em>only</em> when {@link #evict()} is called.</li>
 *   <li>{@code evict()} is called by the service layer on every api_permission_map
 *       mutation (create, update, delete) — so changes take effect on the very next request.</li>
 *   <li>An idle system makes zero unnecessary DB calls — no polling, no TTL timer.</li>
 * </ul>
 *
 * <p><b>When to switch to Redis:</b> When running multiple app instances behind a load
 * balancer, an eviction on instance A won't reach instance B's in-memory cache.
 * At that point, replace this class with a Redis-backed implementation using
 * pub/sub invalidation. The {@link ApiPermissionCache} interface isolates
 * {@link DbAuthorizationManager} from that change entirely.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InMemoryApiPermissionCache implements ApiPermissionCache {

    private final ApiPermissionMapRepository apiPermissionMapRepository;

    // null = not loaded yet / evicted. Non-null = ready to use.
    private volatile Map<String, String> protectedCache = null;
    private volatile Set<String> publicRoutes = null;
    private volatile Set<String> authenticatedOnlyRoutes = null;

    @Override
    public Map<String, String> getAll() {
        ensureLoaded();
        return protectedCache;
    }

    @Override
    public Set<String> getPublicRoutes() {
        ensureLoaded();
        return publicRoutes;
    }

    @Override
    public Set<String> getAuthenticatedOnlyRoutes() {
        ensureLoaded();
        return authenticatedOnlyRoutes;
    }

    /**
     * Evicts the cache. The next call to any getter will trigger a fresh DB load.
     * Called automatically by the service layer after any api_permission_map mutation.
     */
    @Override
    public void evict() {
        protectedCache = null;
        publicRoutes = null;
        authenticatedOnlyRoutes = null;
        log.info("ApiPermissionCache evicted — will reload on next request");
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private void ensureLoaded() {
        if (protectedCache == null) {
            reload();
        }
    }

    private synchronized void reload() {
        // Double-checked locking — another thread may have loaded while this one waited
        if (protectedCache != null) return;

        log.info("Loading ApiPermissionCache from database...");
        List<ApiPermissionMap> mappings = apiPermissionMapRepository.findByActiveTrue();

        Map<String, String> freshProtected = new HashMap<>();
        Set<String> freshPublic = new HashSet<>();
        Set<String> freshAuthOnly = new HashSet<>();

        for (ApiPermissionMap m : mappings) {
            String key = m.getHttpMethod().toUpperCase() + "::" + m.getPathPattern();
            if (m.isPublic()) {
                freshPublic.add(key);
            } else if (m.isAuthenticatedOnly()) {
                freshAuthOnly.add(key);
            } else if (m.getPermission() != null) {
                freshProtected.put(key, m.getPermission().getCode());
            }
        }

        // Assign all at once — keeps the volatile fields consistent
        protectedCache = freshProtected;
        publicRoutes = freshPublic;
        authenticatedOnlyRoutes = freshAuthOnly;

        log.info("ApiPermissionCache loaded: {} protected, {} public, {} authenticated-only entries",
                freshProtected.size(), freshPublic.size(), freshAuthOnly.size());
    }
}
