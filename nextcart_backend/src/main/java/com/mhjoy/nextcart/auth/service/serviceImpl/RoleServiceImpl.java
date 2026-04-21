package com.mhjoy.nextcart.auth.service.serviceImpl;

import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.dto.request.AssignRolePermissionsRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.response.PermissionResponseDto;
import com.mhjoy.nextcart.auth.dto.response.RoleResponseDto;
import com.mhjoy.nextcart.auth.entity.Permission;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.exception.PermissionNotFoundException;
import com.mhjoy.nextcart.auth.exception.ProtectedRoleDeletionException;
import com.mhjoy.nextcart.auth.exception.RoleAlreadyExistsException;
import com.mhjoy.nextcart.auth.exception.RoleInUseException;
import com.mhjoy.nextcart.auth.exception.RoleNotFoundException;
import com.mhjoy.nextcart.auth.repository.PermissionRepository;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.auth.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RoleResponseDto createRole(CreateRoleRequestDto requestDto) {
        if (roleRepository.existsByName(requestDto.name())) {
            throw new RoleAlreadyExistsException(requestDto.name());
        }

        Role role = new Role(requestDto.name(), requestDto.description());
        Role saved = roleRepository.save(role);
        log.info("Role created: {}", saved.getName());
        return toRoleResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponseDto> listAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toRoleResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        if (SystemRoles.isReserved(role.getName()) || SystemRoles.ADMIN.equals(role.getName())) {
            throw new ProtectedRoleDeletionException(role.getName());
        }

        if (userRepository.existsByRoles_Id(roleId)) {
            throw new RoleInUseException(role.getName());
        }

        role.getPermissions().clear();
        roleRepository.save(role);
        roleRepository.delete(role);

        log.info("Role deleted: {}", role.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDto getPermissionsForRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));
        return toRoleResponse(role);
    }

    @Override
    @Transactional
    public RoleResponseDto assignPermissionsToRole(Long roleId, AssignRolePermissionsRequestDto requestDto) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        Set<Permission> permissions = permissionRepository.findAllByIdIn(requestDto.permissionIds());
        if (permissions.size() != requestDto.permissionIds().size()) {
            throw new PermissionNotFoundException("One or more permission IDs not found");
        }

        role.getPermissions().clear();
        role.getPermissions().addAll(permissions);
        Role saved = roleRepository.save(role);

        log.info("Assigned {} permissions to role {}", permissions.size(), role.getName());
        return toRoleResponse(saved);
    }

    private RoleResponseDto toRoleResponse(Role role) {
        Set<PermissionResponseDto> permissions = role.getPermissions().stream()
                .map(this::toPermissionResponse)
                .collect(Collectors.toSet());
        return new RoleResponseDto(role.getId(), role.getName(), role.getDescription(), permissions);
    }

    private PermissionResponseDto toPermissionResponse(Permission permission) {
        return new PermissionResponseDto(
                permission.getId(),
                permission.getCode(),
                permission.getDescription(),
                permission.getModule(),
                permission.getCreatedAt()
        );
    }
}
