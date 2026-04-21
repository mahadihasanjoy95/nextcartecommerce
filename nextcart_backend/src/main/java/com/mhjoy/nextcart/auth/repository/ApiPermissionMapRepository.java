package com.mhjoy.nextcart.auth.repository;

import com.mhjoy.nextcart.auth.entity.ApiPermissionMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiPermissionMapRepository extends JpaRepository<ApiPermissionMap, Long> {

    /**
     * Loads all active mappings for the in-memory cache warm-up.
     */
    List<ApiPermissionMap> findByActiveTrue();

    boolean existsByHttpMethodIgnoreCaseAndPathPattern(String httpMethod, String pathPattern);

    Optional<ApiPermissionMap> findByHttpMethodIgnoreCaseAndPathPattern(String httpMethod, String pathPattern);
}
