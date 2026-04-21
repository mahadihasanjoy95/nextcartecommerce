package com.mhjoy.nextcart.auth;

import com.mhjoy.nextcart.auth.entity.ApiPermissionMap;
import com.mhjoy.nextcart.auth.entity.Permission;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.auth.repository.ApiPermissionMapRepository;
import com.mhjoy.nextcart.auth.repository.PermissionRepository;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Idempotent seed data initializer. Runs at startup and only inserts
 * records that do not already exist — safe to restart repeatedly.
 *
 * <p>Seeding order:
 * <ol>
 *   <li>Roles (SUPER_ADMIN, ADMIN, CUSTOMER)</li>
 *   <li>Permissions (all module:action codes)</li>
 *   <li>Assign baseline permissions to ADMIN role</li>
 *   <li>Super Admin user (from application.properties)</li>
 *   <li>API permission mappings (insert missing + correct wrong permission codes)</li>
 * </ol>
 *
 * <p><b>Permission ownership model:</b>
 * <ul>
 *   <li>Permissions are developer-defined — seeded here, never created by admin in normal flow</li>
 *   <li>SUPER_ADMIN can create permissions via API in exceptional cases</li>
 *   <li>ADMIN can: assign permissions to roles, toggle api-map public/active</li>
 *   <li>Only SUPER_ADMIN can: create/delete api-permission-maps, create permissions</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final ApiPermissionMapRepository apiPermissionMapRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.seed.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.seed.superadmin.password}")
    private String superAdminPassword;

    @Value("${app.seed.superadmin.first-name}")
    private String superAdminFirstName;

    @Value("${app.seed.superadmin.last-name}")
    private String superAdminLastName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Running DataInitializer...");

        migrateSchema();  // must run first — fixes column constraints Hibernate update mode won't touch
        Map<String, Role> roles = seedRoles();
        Map<String, Permission> permissions = seedPermissions();
        seedAdminRolePermissions(roles.get(SystemRoles.ADMIN), permissions);
        ensureAdminHasReadPermissions(roles.get(SystemRoles.ADMIN), permissions);
        seedCustomerRolePermissions(roles.get(SystemRoles.CUSTOMER), permissions);
        seedSuperAdmin(roles.get(SystemRoles.SUPER_ADMIN));
        seedApiPermissionMaps(permissions);
        correctApiPermissionMaps(permissions);

        log.info("DataInitializer completed.");
    }

    /**
     * Applies schema changes that Hibernate ddl-auto=update cannot handle —
     * specifically column nullability changes on existing tables.
     * Each statement is idempotent: safe to run on every startup.
     */
    private void migrateSchema() {
        // permission_id must be nullable to support public and authenticated-only routes.
        // ddl-auto=update never alters nullability of existing columns, so we do it here.
        try {
            jdbcTemplate.execute(
                "ALTER TABLE api_permission_map MODIFY permission_id BIGINT NULL"
            );
            log.info("Schema migration: api_permission_map.permission_id set to nullable");
        } catch (Exception e) {
            // Column may already be nullable — safe to ignore
            log.debug("Schema migration skipped (already applied): {}", e.getMessage());
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    private Map<String, Role> seedRoles() {
        Map<String, Role> result = new HashMap<>();
        seedRole(SystemRoles.SUPER_ADMIN, "Full unrestricted access — bypasses all permission checks", result);
        seedRole(SystemRoles.ADMIN, "Operational staff — access governed by permission assignments", result);
        seedRole(SystemRoles.CUSTOMER, "End-user — limited access to own data and public APIs", result);
        return result;
    }

    private void seedRole(String name, String description, Map<String, Role> result) {
        Role role = roleRepository.findByName(name).orElseGet(() -> {
            log.info("Seeding role: {}", name);
            return roleRepository.save(new Role(name, description));
        });
        result.put(name, role);
    }

    private Map<String, Permission> seedPermissions() {
        List<Object[]> definitions = List.of(
                // code, description, module
                // ── Product ──────────────────────────────────────────────────────────
                new Object[]{"product:create",          "Create products",                          "product"},
                new Object[]{"product:update",          "Update products",                          "product"},
                new Object[]{"product:delete",          "Delete products",                          "product"},
                new Object[]{"product:read-admin",      "Read products with admin details",         "product"},
                // ── Category ─────────────────────────────────────────────────────────
                new Object[]{"category:create",         "Create categories",                        "product"},
                new Object[]{"category:update",         "Update categories",                        "product"},
                new Object[]{"category:delete",         "Delete categories",                        "product"},
                // ── Brand ────────────────────────────────────────────────────────────
                new Object[]{"brand:create",            "Create brands",                            "product"},
                new Object[]{"brand:update",            "Update brands",                            "product"},
                new Object[]{"brand:delete",            "Delete brands",                            "product"},
                // ── User ─────────────────────────────────────────────────────────────
                new Object[]{"user:create",             "Create admin/customer users",              "user"},
                new Object[]{"user:read",               "Read user profiles",                       "user"},
                new Object[]{"user:update",             "Update user accounts",                     "user"},
                new Object[]{"user:disable",            "Enable or disable user accounts",          "user"},
                new Object[]{"user:delete",             "Delete user accounts",                     "user"},
                // ── Auth / Role ───────────────────────────────────────────────────────
                new Object[]{"role:permission-assign",  "Assign permissions to roles",              "auth"},
                // ── Read (public-facing catalogue) ──────────────────────────────────────
                new Object[]{"product:read",            "Read/list products (public catalogue)",          "product"},
                new Object[]{"category:read",           "Read/list categories (public catalogue)",        "product"},
                new Object[]{"brand:read",              "Read/list brands (public catalogue)",            "product"},
                // ── API Map ───────────────────────────────────────────────────────────
                // api-map:manage  — SUPER_ADMIN only: create/delete maps, create permissions
                // api-map:toggle  — ADMIN: read maps, toggle is_public / active
                new Object[]{"api-map:manage",          "Create or delete API permission mappings", "auth"},
                new Object[]{"api-map:toggle",          "Toggle public/active on API permission mappings", "auth"}
        );

        Map<String, Permission> result = new HashMap<>();
        for (Object[] def : definitions) {
            String code = (String) def[0];
            Permission permission = permissionRepository.findByCode(code).orElseGet(() -> {
                log.info("Seeding permission: {}", code);
                return permissionRepository.save(new Permission(code, (String) def[1], (String) def[2]));
            });
            result.put(code, permission);
        }
        return result;
    }

    private void seedAdminRolePermissions(Role adminRole, Map<String, Permission> permissions) {
        Set<Permission> baselinePermissions = new HashSet<>(permissions.values());
        baselinePermissions.remove(permissions.get("api-map:manage"));

        boolean changed = false;
        for (Permission permission : baselinePermissions) {
            if (!adminRole.getPermissions().contains(permission)) {
                adminRole.getPermissions().add(permission);
                changed = true;
                log.info("Added missing baseline permission to ADMIN role: {}", permission.getCode());
            }
        }

        if (changed) {
            roleRepository.save(adminRole);
        }
    }

    private void seedSuperAdmin(Role superAdminRole) {
        if (userRepository.existsByEmail(superAdminEmail)) return;

        User superAdmin = new User();
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPasswordHash(passwordEncoder.encode(superAdminPassword));
        superAdmin.setFirstName(superAdminFirstName);
        superAdmin.setLastName(superAdminLastName);
        superAdmin.setUserType(UserType.STAFF);
        superAdmin.setEnabled(true);
        superAdmin.setEmailVerified(true);
        superAdmin.getRoles().add(superAdminRole);

        userRepository.save(superAdmin);
        log.info("Super admin seeded: {}", superAdminEmail);
    }

    private void ensureAdminHasReadPermissions(Role adminRole, Map<String, Permission> permissions) {
        List<String> readCodes = List.of("product:read", "category:read", "brand:read");
        boolean changed = false;
        for (String code : readCodes) {
            Permission p = permissions.get(code);
            if (p != null && !adminRole.getPermissions().contains(p)) {
                adminRole.getPermissions().add(p);
                changed = true;
                log.info("Added missing permission to ADMIN role: {}", code);
            }
        }
        if (changed) roleRepository.save(adminRole);
    }

    private void seedCustomerRolePermissions(Role customerRole, Map<String, Permission> permissions) {
        List<String> customerCodes = List.of("product:read", "category:read", "brand:read");
        boolean changed = false;
        for (String code : customerCodes) {
            Permission p = permissions.get(code);
            if (p != null && !customerRole.getPermissions().contains(p)) {
                customerRole.getPermissions().add(p);
                changed = true;
                log.info("Added permission to CUSTOMER role: {}", code);
            }
        }
        if (changed) roleRepository.save(customerRole);
    }

    // ──────────────────────────────────────────────────────────────────────────

    private void seedApiPermissionMaps(Map<String, Permission> permissions) {

        // ── Public routes (is_public = true, no JWT required) ─────────────────
        // Admin can toggle these at runtime via PATCH /api/v1/api-permission-maps/{id}
        List<Object[]> publicMappings = List.of(
                new Object[]{"POST", "/api/v1/auth/register",         "Customer self-registration"},
                new Object[]{"POST", "/api/v1/auth/login",            "Login — returns token pair"},
                new Object[]{"POST", "/api/v1/auth/refresh",          "Refresh token rotation"},
                new Object[]{"POST", "/api/v1/auth/forgot-password",  "Request password reset email"},
                new Object[]{"POST", "/api/v1/auth/reset-password",   "Reset password via token"}
        );

        for (Object[] def : publicMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String description = (String) def[2];
            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;
            apiPermissionMapRepository.save(new ApiPermissionMap(method, pathPattern, description));
            log.info("Seeded public api map: {} {}", method, pathPattern);
        }

        // ── Authenticated-only routes (any valid JWT, no specific permission) ──
        List<Object[]> authOnlyMappings = List.of(
                new Object[]{"POST", "/api/v1/auth/logout", "Logout — revoke refresh token"},
                new Object[]{"GET",  "/api/v1/auth/me",     "Get current user profile"}
        );

        for (Object[] def : authOnlyMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String description = (String) def[2];
            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;
            apiPermissionMapRepository.save(ApiPermissionMap.authenticatedOnly(method, pathPattern, description));
            log.info("Seeded authenticated-only api map: {} {}", method, pathPattern);
        }

        // ── Permission-protected routes ────────────────────────────────────────
        //
        // Permission ownership:
        //   ADMIN (role:permission-assign)  → user/role management
        //   ADMIN (api-map:toggle)          → read maps + toggle public/active
        //   SUPER_ADMIN only (api-map:manage) → create/delete maps, create permissions
        //
        List<Object[]> protectedMappings = List.of(
                // ── Products ────────────────────────────────────────────────────────
                new Object[]{"GET",    "/api/v1/products",                  "product:read",            "List products"},
                new Object[]{"GET",    "/api/v1/products/**",               "product:read",            "Get product details"},
                new Object[]{"GET",    "/api/v1/admin/products",            "product:read-admin",      "List products for admin"},
                new Object[]{"GET",    "/api/v1/admin/products/**",         "product:read-admin",      "Get product details for admin"},
                new Object[]{"POST",   "/api/v1/products",                  "product:create",          "Create product"},
                new Object[]{"PUT",    "/api/v1/products/**",               "product:update",          "Update product"},
                new Object[]{"PATCH",  "/api/v1/products/**",               "product:update",          "Patch product"},
                new Object[]{"DELETE", "/api/v1/products/**",               "product:delete",          "Delete product"},
                // ── Categories ──────────────────────────────────────────────────────
                new Object[]{"GET",    "/api/v1/categories",                "category:read",           "List categories"},
                new Object[]{"POST",   "/api/v1/categories",                "category:create",         "Create category"},
                new Object[]{"PUT",    "/api/v1/categories/**",             "category:update",         "Update category"},
                new Object[]{"PATCH",  "/api/v1/categories/**",             "category:update",         "Patch category"},
                new Object[]{"DELETE", "/api/v1/categories/**",             "category:delete",         "Delete category"},
                // ── Brands ──────────────────────────────────────────────────────────
                new Object[]{"GET",    "/api/v1/brands",                    "brand:read",              "List brands"},
                new Object[]{"POST",   "/api/v1/brands",                    "brand:create",            "Create brand"},
                new Object[]{"PUT",    "/api/v1/brands/**",                 "brand:update",            "Update brand"},
                new Object[]{"PATCH",  "/api/v1/brands/**",                 "brand:update",            "Patch brand"},
                new Object[]{"DELETE", "/api/v1/brands/**",                 "brand:delete",            "Delete brand"},
                // ── Users ───────────────────────────────────────────────────────────
                new Object[]{"POST",   "/api/v1/users",                     "user:create",             "Create user"},
                new Object[]{"GET",    "/api/v1/users",                     "user:read",               "List users"},
                new Object[]{"GET",    "/api/v1/users/admins",              "user:read",               "List admin users"},
                new Object[]{"GET",    "/api/v1/users/customers",           "user:read",               "List customer users"},
                new Object[]{"GET",    "/api/v1/users/**",                  "user:read",               "Get user by id"},
                new Object[]{"PATCH",  "/api/v1/users/*/enable",            "user:disable",            "Enable user"},
                new Object[]{"PATCH",  "/api/v1/users/*/disable",           "user:disable",            "Disable user"},
                new Object[]{"DELETE", "/api/v1/users/*",                   "user:delete",             "Delete user"},
                new Object[]{"PUT",    "/api/v1/users/*/role",              "role:permission-assign",  "Assign user role"},
                // ── Permissions & Roles (ADMIN) ──────────────────────────────────────
                new Object[]{"POST",   "/api/v1/roles",                     "role:permission-assign",  "Create role"},
                new Object[]{"GET",    "/api/v1/roles",                     "role:permission-assign",  "List roles"},
                new Object[]{"DELETE", "/api/v1/roles/**",                  "role:permission-assign",  "Delete role"},
                new Object[]{"GET",    "/api/v1/permissions",               "role:permission-assign",  "List permissions"},
                new Object[]{"GET",    "/api/v1/roles/**",                  "role:permission-assign",  "Get role permissions"},
                new Object[]{"PUT",    "/api/v1/roles/**",                  "role:permission-assign",  "Assign role permissions"},
                // ── Create Permission (SUPER_ADMIN only) ────────────────────────────
                new Object[]{"POST",   "/api/v1/permissions",               "api-map:manage",          "Create permission — SUPER_ADMIN only"},
                // ── API Permission Maps: read + toggle (ADMIN) ───────────────────────
                new Object[]{"GET",    "/api/v1/api-permission-maps",       "api-map:toggle",          "List api permission maps"},
                new Object[]{"PATCH",  "/api/v1/api-permission-maps/**",    "api-map:toggle",          "Toggle public/active on api map"},
                // ── API Permission Maps: create + delete (SUPER_ADMIN only) ──────────
                new Object[]{"POST",   "/api/v1/api-permission-maps",       "api-map:manage",          "Create api permission map — SUPER_ADMIN only"},
                new Object[]{"DELETE", "/api/v1/api-permission-maps/**",    "api-map:manage",          "Delete api permission map — SUPER_ADMIN only"}
        );

        for (Object[] def : protectedMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String permCode = (String) def[2];
            String description = (String) def[3];

            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;

            Permission permission = permissions.get(permCode);
            if (permission == null) {
                log.warn("Skipping api map seed for {} {} — permission '{}' not found", method, pathPattern, permCode);
                continue;
            }

            apiPermissionMapRepository.save(new ApiPermissionMap(method, pathPattern, permission, description));
            log.info("Seeded protected api map: {} {} → {}", method, pathPattern, permCode);
        }
    }

    /**
     * Corrects permission codes on already-seeded api_permission_map rows.
     * Runs on every startup — only updates rows where the permission code has changed.
     * This handles existing databases that were seeded with old/wrong permission codes.
     */
    private void correctApiPermissionMaps(Map<String, Permission> permissions) {
        // method, pathPattern → correct permissionCode
        List<Object[]> corrections = List.of(
                // Migrate public catalogue routes → permission-based (existing DB rows)
                new Object[]{"GET",   "/api/v1/products",                "product:read"},
                new Object[]{"GET",   "/api/v1/products/**",             "product:read"},
                new Object[]{"GET",   "/api/v1/categories",              "category:read"},
                new Object[]{"GET",   "/api/v1/brands",                  "brand:read"},
                // Correct permission codes on admin-management routes
                new Object[]{"POST",  "/api/v1/permissions",             "api-map:manage"},
                new Object[]{"GET",   "/api/v1/api-permission-maps",     "api-map:toggle"},
                new Object[]{"PATCH", "/api/v1/api-permission-maps/**",  "api-map:toggle"}
        );

        for (Object[] def : corrections) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String correctCode = (String) def[2];

            apiPermissionMapRepository.findByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)
                    .ifPresent(map -> {
                        String currentCode = map.getPermission() != null
                                ? map.getPermission().getCode() : null;
                        if (!correctCode.equals(currentCode)) {
                            Permission correctPermission = permissions.get(correctCode);
                            if (correctPermission != null) {
                                map.setPermission(correctPermission);
                                map.setPublic(false);
                                map.setAuthenticatedOnly(false);
                                apiPermissionMapRepository.save(map);
                                log.info("Corrected api map permission: {} {} → {} (was: {})",
                                        method, pathPattern, correctCode, currentCode);
                            }
                        }
                    });
        }
    }
}
