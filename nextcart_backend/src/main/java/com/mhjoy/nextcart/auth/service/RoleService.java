package com.mhjoy.nextcart.auth.service;

import com.mhjoy.nextcart.auth.dto.request.AssignRolePermissionsRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.response.RoleResponseDto;

import java.util.List;

public interface RoleService {

    RoleResponseDto createRole(CreateRoleRequestDto requestDto);

    List<RoleResponseDto> listAllRoles();

    void deleteRole(Long roleId);

    RoleResponseDto getPermissionsForRole(Long roleId);

    RoleResponseDto assignPermissionsToRole(Long roleId, AssignRolePermissionsRequestDto requestDto);
}
