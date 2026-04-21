package com.mhjoy.nextcart.auth.repository;

import com.mhjoy.nextcart.auth.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByCode(String code);

    boolean existsByCode(String code);

    List<Permission> findByModule(String module);

    Set<Permission> findAllByIdIn(Set<Long> ids);
}
